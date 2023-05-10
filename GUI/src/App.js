import './App.css';
import React from 'react';
import { TextField, Button, Box, Divider, Grid, MenuItem, InputLabel, FormControl, FormHelperText, Select, Typography, TextareaAutosize } from '@mui/material';
import { DataTable } from './components/datatable';
import StickyFooter from './components/footer';
import { getDataFromGraphDB } from './lib/io_utils';
import { fwList } from './lib/frameworks';
import MapChart from './components/MapChart';

/**
 * 
 * @param {Object} props Properties inherited to set state of the app
 * @returns Main React App with a dropdown menu for the year, the geography, the framework and the category
 */
function App(props) {


/**
 * list of all the different states of the GUI
 */
  const [geographyState, setGeographyState] = React.useState('');
  const [showMapState, setShowMapState] = React.useState('');
  const [relaxState, setRelaxState] = React.useState(true);
  const [yearState, setYearState] = React.useState('');
  const [categoryState, setCategoryState] = React.useState('');
  const [frameworkState, setFrameworkState] = React.useState('');
  const [tableState, setTableState] = React.useState('');
  const [descriptionState, setDescriptionState] = React.useState('')
  const [longState, setLongState] = React.useState(47.00016);
  const [latState, setLatState] = React.useState(8.01427)

  /**
   * 
   * @param {React.ChangeEvent} event Event triggered from dropdown to set the new state
   */
  const handleFramework = (event) => {
    setFrameworkState(event.target.value);
  };

  /**
   * 
   * @param {React.ChangeEvent} event Event triggered from dropdown to set the new state
   */
  const handleCategory = (event) => {
    setCategoryState(event.target.value);
  };

  /**
 * 
 * @param {React.ChangeEvent} event Event triggered from dropdown to set the new state
 */
  const handleCountry = (event) => {
    setGeographyState(event.target.value);
  };

 /**
 * 
 * @param {React.ChangeEvent} event Event triggered from dropdown to set the new state
 */
  const handleYear = (event) => {
    setYearState(event.target.value);
  };

 /**
 * 
 * @param {React.ChangeEvent} event Event triggered from textarea to set the new state
 */
  function updateToken(e) {
    props.setTokenState(e.target.value)
  }

  /**
   * returns a list of possible categories, these are at the moment just dummy values. Could be added to the KG, but are out of scope for this paper.
   */
  const catList = [
    { value: "Purchased goods and services", label: "Purchased goods and services" },
    { value: "Emissions from purchased goods", label: "Emissions from purchased goods" },
  ]

  /**
   * 
   * @param {String} tokenState token value for Bearer authentication (if needed, please set showTokenState to true in index.js)
   * @returns a textarea where a user can insert a valid Bearer authentication token (if GraphDB is set up to use the OAuth authentication mechanism). The token will be added to each request.
   */
  const tokenInserter = (tokenState) => {
    if (!props.showTokenState || (tokenState && tokenState.length > 0)) {

    } else {
      return (
        <TextareaAutosize
          minRows={5}
          onChange={e => updateToken(e)}
        >
        </TextareaAutosize>
      )
    }
  }

  /**
   * parses the HTTP repsonse from the GraphDB and convert the return values into a data table to display. The value set as year, category and framework are added here as well for demonstration purposes, since their integration is out of scope for this paper.
   * @param {HTTP.Response} response 
   */
  function parseData(response) {

    const dataTable = []
    response.forEach(row => {
      let baseObject = {}
      row.forEach(entry => {
        baseObject[entry.key] = entry.value
        if (entry.key == 'lat') {
          setLatState(entry.value)
        }
        if (entry.key == 'long') {
          setLongState(entry.value)
        }
      }
      )
      dataTable.push(baseObject)
    })
    setTableState(dataTable)
    setShowMapState(true)
  }
  /**
   * function to check which query should be sent to graphDB
   */
  const transformQuery = () => {
    if (geographyState === null || geographyState.length === 0) {
      let query =
        `
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX : <https://purl.org/wiser#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX gn: <http://www.geonames.org/ontology#>
      PREFIX wgs84_pos: <http://www.w3.org/2003/01/geo/wgs84_pos#>

      select distinct ?activity ?activityName ?geographyTerm ?long ?lat ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) WHERE {
        ?activity a :BActivity.
          ?activity rdfs:label ?activityName.
          ?activity :bGeography ?geo.
          ?geo :bLocationShortname ?geographyTerm.
          ?filter (:bGeographyParent)* ?parent.
          ?parent :bLocationShortname ?geographyTerm.
          ?filter wgs84_pos:lat ?lat.
          ?filter wgs84_pos:long ?long.
          OPTIONAL{
              ?childCounter (:bGeographyParent)* ?parent.
              ?filter (:bGeographyParent)* ?childCounter.
          }
      }
      GROUP BY ?activity ?activityName ?geographyTerm ?long ?lat
      ORDER BY ASC(?ranking)
      `
      return query;
    }  else if (geographyState && geographyState.length > 0 && relaxState && descriptionState && descriptionState.length > 0) {
      let query =
        `
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX : <https://purl.org/wiser#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX gn: <http://www.geonames.org/ontology#>
      PREFIX wgs84_pos: <http://www.w3.org/2003/01/geo/wgs84_pos#>

      select distinct ?activity ?activityName ?geographyTerm ?long ?lat ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) WHERE {
        ?activity a :BActivity.
          ?activity rdfs:label ?activityName.
          ?activity :bGeography ?geo.
          ?geo :bLocationShortname ?geographyTerm.
          ?filter (:bGeographyParent)* ?parent.
          ?parent :bLocationShortname ?geographyTerm.
          ?filter wgs84_pos:lat ?lat.
          ?filter wgs84_pos:long ?long.
          OPTIONAL{
              ?childCounter (:bGeographyParent)* ?parent.
              ?filter (:bGeographyParent)* ?childCounter.
          }
          FILTER(?filter = <${geographyState}>)
          FILTER (REGEX (?activityName , "${descriptionState}" ))
      }
      GROUP BY ?activity ?activityName ?geographyTerm ?long ?lat
      ORDER BY ASC(?ranking)
      `

      return query;
    } else if (geographyState && geographyState.length > 0 && relaxState ) {
      let query =
        `
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX : <https://purl.org/wiser#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX gn: <http://www.geonames.org/ontology#>
      PREFIX wgs84_pos: <http://www.w3.org/2003/01/geo/wgs84_pos#>

      select distinct ?activity ?activityName ?geographyTerm ?long ?lat ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) WHERE {
        ?activity a :BActivity.
          ?activity rdfs:label ?activityName.
          ?activity :bGeography ?geo.
          ?geo :bLocationShortname ?geographyTerm.
          ?filter (:bGeographyParent)* ?parent.
          ?parent :bLocationShortname ?geographyTerm.
          ?filter wgs84_pos:lat ?lat.
          ?filter wgs84_pos:long ?long.
          OPTIONAL{
              ?childCounter (:bGeographyParent)* ?parent.
              ?filter (:bGeographyParent)* ?childCounter.
          }
          FILTER(?filter = <${geographyState}>)
      }
      GROUP BY ?activity ?activityName ?geographyTerm ?long ?lat
      ORDER BY ASC(?ranking)
      `

      return query;
    }
    else {
      console.log("error state detected: ", geographyState)
      let query = `
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX : <https://purl.org/wiser#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX wgs84_pos: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX gn: <http://www.geonames.org/ontology#>

      select distinct ?activity ?activityName ?geographyTerm ?long ?lat ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking)  WHERE {
        ?activity a :BActivity.
          ?activity rdfs:label ?activityName.
          ?activity :bGeography ?geo.
          ?geo :bLocationShortname ?geographyTerm.
          ?filter (:bGeographyParent)* ?parent.
          ?filter wgs84_pos:lat ?lat.
          ?filter wgs84_pos:long ?long.
          ?parent :bLocationShortname ?geographyTerm.
          OPTIONAL{
              ?childCounter (:bGeographyParent)* ?parent.
              ?filter (:bGeographyParent)* ?childCounter.
          }
          FILTER(?filter = <https://sws.geonames.org/2658822/>)
          
      }
      GROUP BY ?activity ?activityName ?geographyTerm ?long ?lat
      ORDER BY ASC(?ranking)
      `
      return query;
    }
  }
/**
 * function that queries the GraphDB and parses the returned data using the state given by the GUI
 */
  function handleSearchCommand() {
    getDataFromGraphDB(transformQuery(), props.graphDBState, props.repoState, props.tokenState)
      .then((response) => {
        if (response.length > 0) {
          parseData(response)
        } else {
          setTableState("No data available for this query")
        }
      }
      );
  }

/**
 * Geography Dropdown
 * @returns dropdown list for the available geographies (can be adjusted to your purposes)
 */
  const geographyDropdown = () => {
    return (
      <FormControl sx={{ m: 2, minWidth: 120 }} >
        <InputLabel id="assessment-country">Country</InputLabel>
        <Select
          labelId="assessment-country"
          id="country-dropdown"
          value={geographyState}
          label="Country"
          onChange={handleCountry}
        >
          <MenuItem value="" key="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'https://sws.geonames.org/2658434/'}>Switzerland</MenuItem>
          <MenuItem value={'https://sws.geonames.org/2921044/'}>Germany</MenuItem>
          <MenuItem value={'https://sws.geonames.org/2782113/'}>Austria</MenuItem>
          <MenuItem value={'https://sws.geonames.org/2017370/'}>Russia</MenuItem>
          <MenuItem value={'https://sws.geonames.org/3017382/'}>France</MenuItem>
          <MenuItem value={'https://sws.geonames.org/298795/'}>Turkey</MenuItem>
          <MenuItem value={'https://sws.geonames.org/2750405/'}>Netherlands</MenuItem>
          <MenuItem value={'https://sws.geonames.org/2658822/'}>St. Gallen</MenuItem>
          <MenuItem value={'https://sws.geonames.org/2658576/'}>Sion</MenuItem>
        </Select>
        <FormHelperText>If None, all regions will be selected</FormHelperText>
      </FormControl>
    )
  }

/**
 * Time Dropdown
 * @returns dropdown listing 25 year in the past as well as three years ahead
 */
  const yearDropdown = () => {
    let year = new Date().getFullYear()
    //get next three years as well
    year = year + 3
    let yearListItems = Array.from(Array(25).keys()).map(n => {
      let newYear = year - n
      return <MenuItem value={newYear} key={newYear}>{newYear}</MenuItem>
    })

    return (
      <FormControl sx={{ m: 2, minWidth: 120 }}>
        <InputLabel id="assessment-year">Year</InputLabel>
        <Select
          labelId="assessment-year"
          id="year-dropdown"
          label="Year"
          value={yearState}
          onChange={handleYear}>
          <MenuItem value="" key="">
            <em>None</em>
          </MenuItem>
          {yearListItems}
        </Select>
        <FormHelperText>If None, all available years will be selected</FormHelperText>
      </FormControl>
    )
  }
/**
 * converts the given categories into MenuItems
 * @returns MenuItem list of categories
 */
  const categoryList = () => {
    return catList.map(category => {
      return <MenuItem value={category.value} key={category.value}>{category.label}</MenuItem>
    })
  }
/**
 * Category Dropdown
 * @returns dropdown listing all categories
 */
  const categoryDropdown = () => {
    return (
      <FormControl sx={{ m: 2, minWidth: 120 }} pb={3}>
        <InputLabel id="assessment-category">Category</InputLabel>
        <Select
          labelId="assessment-category"
          id="category-dropdown"
          value={categoryState}
          label="category"
          onChange={handleCategory}
        >
          <MenuItem value="" key="">
            <em>None</em>
          </MenuItem>
          {categoryList()}
        </Select>
        <FormHelperText>if None, all frameworks will be selected</FormHelperText>
      </FormControl>
    )
  }
/**
 * Framework dropdown
 * @returns dropdown of all frameworks
 */
  const frameworkDropdown = () => {
    return (
      <FormControl sx={{ m: 2, minWidth: 120 }} pb={3}>
        <InputLabel id="assessment-framework">Framework</InputLabel>
        <Select
          labelId="assessment-framework"
          id="framework-dropdown"
          value={frameworkState}
          label="framework"
          onChange={handleFramework}
        >
          <MenuItem value="" key="">
            <em>None</em>
          </MenuItem>
          {fwList()}
        </Select>
        <FormHelperText>if None, all frameworks will be selected</FormHelperText>
      </FormControl>
    )
  }
/**
 * SearchTerm TextField
 * @returns textfield input for entering a description search term
 */
  const descriptionText = () => {
    return (
      <FormControl sx={{ m: 2, minWidth: 120 }} pb={3}>
        
        <TextField
          labelId="assessment-description"
          id="description-text"
          value={descriptionState}
          onChange={e => setDescriptionState(e.target.value)}
        >
        </TextField>
        <FormHelperText>if None, all datasets will be selected</FormHelperText>
      </FormControl>
    )
  }

  /**
   * 
   * @returns map of the geography indicating where the geography is located
   */
  const showMap = () => {
    if (showMapState) {
      return (
        <MapChart long={longState} lat={latState}></MapChart>
      )
    }
  }

  return (
    <div className="App2">

      <Divider p={5} />

      <div className="Box">

        <Box
          sx={{
            width: "90%",
            margin: 'auto',
            padding: '10px'
          }}
        >
          {tokenInserter(props.tokenState)}
          <Grid
            container
            spacing={3}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >

            <Grid item xs
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >

              <Box pt={3}>
                <Typography variant='h6'>
                  Assessment year
                </Typography>

              </Box>
              {yearDropdown()}
            </Grid>

            {/*<Divider orientation="vertical" flexItem />*/}

            <Grid item xs
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >

              <Box pt={3}>
                <Typography variant='h6'>
                  Assessment geography
                </Typography>
              </Box>
              {geographyDropdown()}
            </Grid>

            {/*<Divider orientation="vertical" flexItem />*/}

            <Grid item xs
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >

              <Box pt={3}>
                <Typography variant='h6'>
                  Assessment framework
                </Typography>
              </Box>
              {frameworkDropdown()}

            </Grid>

            <Grid item xs
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >

              <Box pt={3}>
                <Typography variant='h6'>
                  Assessment category
                </Typography>
              </Box>
              {categoryDropdown()}
            </Grid>

            <Grid item xs
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >

              <Box pt={3}>
                <Typography variant='h6'>
                  Description
                </Typography>
              </Box>
              {descriptionText()}
            </Grid>

          </Grid>

          <Divider p={5} />
          <Grid item xs
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              alignContent={'center'}
            >


              <Button
                variant="outlined"
                onClick={e => handleSearchCommand()}
              >
                Search
              </Button>

              <FormHelperText>Find datasets</FormHelperText>

            </Box>
          </Grid>


        </Box>

        <Box m='auto' maxWidth='80%' marginBottom='50px'>
          <DataTable title="results" data={tableState} time={yearState} category={categoryState} framework={frameworkState} />
          {showMap()}
        </Box>

        <Divider p={5} />

        <Grid id="query">{transformQuery()}</Grid>

        <StickyFooter />

      </div>
    </div>
  );
}

export default App;


