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
  ];
  return (
    <BasicTabs tabs={tabsData}/>
  );
}
