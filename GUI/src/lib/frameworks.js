import MenuItem from '@mui/material/MenuItem';
/**
 * Place to enter your framework data. Those are added to the Knowledge Graph as well, but are out of scope for this paper
 */
const frameworkList = [
    {value: "GHGProtocolScope3", label: "GHG Protocol Scope 3"},
  { value: "ISO14064-1", label: "ISO 14064-1" },
  {value: "GHGProtocolCorporate-1", label: "GHG Protocol Corporate"},
]
/**
 * MenuItem list of frameworks
 * @returns MenuItem list of frameworks
 */
const fwList = () => {
    return frameworkList.map(framework => {
      return <MenuItem value={framework.value} key={framework.value}>{framework.label}</MenuItem>
    })
  }

export {fwList}