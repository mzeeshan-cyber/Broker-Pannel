import Typography from '@mui/material/Typography';
import BasicTabs from 'sections/components-overview/tabs/BasicTabs';
import EstimatedRates from './estimatedRates';
import Holidays from './holidays';

export default function Settings() {
  const tabsData = [
    {
      label: 'Estimated Rates',
      icon: '',
      content: <EstimatedRates/>
    },
    {
      label: 'Federal Holidays',
      icon: '',
      content: <Holidays/>
    },
  ];
  return (
    <BasicTabs tabs={tabsData}/>
  );
}
