// material-ui
import Typography from '@mui/material/Typography';
import BasicTabs from 'sections/components-overview/tabs/BasicTabs';
import EstimatedRates from './estimatedRates';

export default function Settings() {
  const tabsData = [
    {
      label: 'Estimated Rates',
      icon: '',
      content: <EstimatedRates/>
    },
    {
      label: 'Tab2',
      icon: '',
      content: <Typography variant="h6">Content for Tab 2</Typography>
    },
    {
      label: 'Tab3',
      content: <Typography variant="h6">Content for Tab 3</Typography>
    }
  ];
  return (
    <BasicTabs tabs={tabsData}/>
  );
}
