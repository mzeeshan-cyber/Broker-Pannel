import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tab-panel-${index}`
  };
}

// ==============================|| REUSABLE TABS COMPONENT ||============================== //

export default function BasicTabs({ tabs, cardProps, mainCard = true }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {mainCard ?
        <MainCard {...cardProps}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="reusable tabs">
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={tab.label}
                    icon={tab.icon ? <Chip label={tab.icon} color="primary" variant="light" size="small" /> : null}
                    iconPosition={tab.icon ? 'end' : undefined}
                    {...a11yProps(index)}
                  />
                ))}
              </Tabs>
            </Box>
            {tabs.map((tab, index) => (
              <TabPanel key={index} value={value} index={index}>
                {tab.content}
              </TabPanel>
            ))}
          </Box>
        </MainCard> :
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="reusable tabs">
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon ? <Chip label={tab.icon} color="primary" variant="light" size="small" /> : null}
                  iconPosition={tab.icon ? 'end' : undefined}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={value} index={index}>
              {tab.content}
            </TabPanel>
          ))}
        </Box>
      }
    </>
  );
}

BasicTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      content: PropTypes.node.isRequired
    })
  ).isRequired,
  cardProps: PropTypes.object // Optional: pass props to MainCard
};
