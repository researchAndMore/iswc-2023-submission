import { Typography, TableBody, TableCell, TableRow, TableHead, Table, Paper, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({

    table: {
        padding: '50px',
        width: '80%'
    }

})

function DataTable({ title, data, time, framework, category}) {
    const classes = useStyles()
    if (data === 'No data available for this query') {
      return (
        <Paper>
          <Typography variant="h4" color="inherit">
            {title}
          </Typography>
          <hr />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <Box pt={1} pb={1} variant='h6' alignContent='center' align='center'>
                <Typography>
                  No data available for this query
                </Typography>
                </Box>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                <TableRow>
                  {}
                </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
      )
    } if (data !== '') {

      const headersArr = []
      headersArr.push('Year')
      headersArr.push('Framework')
      headersArr.push('Category')

      data.forEach(element => {     
        Object.keys(element).forEach(el => {
          headersArr.push(el)
        }
        )
      });

      let headersSet = new Set(headersArr)
      let headers = [...headersSet]

      data.forEach(line => {
        line['Year'] = time
        line['Framework'] = framework
        line['Category'] = category
      })

      return (
        <Paper>
          <Typography variant="h4" color="inherit">
            {title}
          </Typography>
          <hr />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {headers.map(header => 
                  {
                  return <TableCell align="right">{header.toUpperCase()}</TableCell>
                }
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((emp, index) => (
                <TableRow key={index}>
                  {headers.map(header => {
                    return (
                      <TableCell align="right">{emp[header]}</TableCell>
                    )
                  } )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    } else {
      return (
        <Paper>
          <Typography variant="h4" color="inherit">
            {title}
          </Typography>
          <hr />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <Box pt={1} pb={1} variant='h6'>
                <Typography>
                  'Nothing to show yet, select some values from above and hit search to see an ILCD or EcoSpold dataset'
                </Typography>
                </Box>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                <TableRow>
                  {}
                </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
      )
    }
  }
  
  export {DataTable}