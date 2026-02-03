import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import MainCard from 'components/MainCard';

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


function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tab-panel-${index}`
  };
}


export default function ConmplaintsTabs({ tabs, cardProps, mainCard = true, value: propValue, onChange }) {
  const [internalValue, setInternalValue] = useState(propValue || 0);
  useEffect(() => {
    if (propValue !== undefined) setInternalValue(propValue);
  }, [propValue]);

  const handleChange = (event, newValue) => {
    setInternalValue(newValue); 
    if (typeof onChange === 'function') {
      onChange(event, newValue);  
    }
  };

  return (
    <>
      {mainCard ? (
        <MainCard {...cardProps}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={internalValue} onChange={handleChange} aria-label="reusable tabs">
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
              <TabPanel key={index} value={internalValue} index={index}>
                {tab.content}
              </TabPanel>
            ))}
          </Box>
        </MainCard>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={internalValue} onChange={handleChange} aria-label="reusable tabs">
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
            <TabPanel key={index} value={internalValue} index={index}>
              {tab.content}
            </TabPanel>
          ))}
        </Box>
      )}
    </>
  );
}
