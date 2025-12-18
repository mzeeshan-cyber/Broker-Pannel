// This is example of menu item without group for horizontal layout. There will be no children.


// assets
import { DocumentCode2 } from 'iconsax-react';

// type

// icons
const icons = {
  samplePage: DocumentCode2
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const samplePage = {
  id: 'dashboard',
  title:"Dashboard",
  type: 'group',
  url: '/dashboard',
  icon: icons.samplePage
};

export default samplePage;
