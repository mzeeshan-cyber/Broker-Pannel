import BasicTabs from 'sections/components-overview/tabs/BasicTabs';
import DocumentDetails from './document-details';

export default function GeneralSettings() {
  const tabsData = [
    {
      label: 'Document Detail',
      icon: '',
      content: <DocumentDetails/>
    },
  ];
  return (
    <BasicTabs tabs={tabsData}/>
  );
}
