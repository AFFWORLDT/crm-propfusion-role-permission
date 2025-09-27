import { useState } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import TwitterIcon from '@mui/icons-material/Twitter';
import styles from "../../../styles/TabContainer.module.css";
import GoogleAdsIntegration from "./GoogleAdsIntegration";
import MetaAdsIntegration from "./MetaAdsIntegration";
import TwitterAdsIntegration from "./TwitterAdsIntegration";
import SectionTop from "../../../ui/SectionTop";
import TabBar from "../../../ui/TabBar";
import CustomSideNav from "../../../ui/CustomSideNav";

const integrations = [
  {
    key: 'meta',
    label: 'Meta Ads',
    icon: <FacebookIcon color="primary" />,
    tooltip: 'Integrate with Facebook/Meta Ads',
  },
  {
    key: 'google',
    label: 'Google Ads',
    icon: <GoogleIcon color="error" />,
    tooltip: 'Integrate with Google Ads',
  },
  {
    key: 'twitter',
    label: 'Twitter Ads',
    icon: <TwitterIcon color="info" />,
    tooltip: 'Integrate with Twitter Ads',
  },
];

function IntegrationContainer() {
  const [activeIntegration, setActiveIntegration] = useState("meta");
  const [fadeKey, setFadeKey] = useState("meta");

  const handleTabChange = (key) => {
    setFadeKey("");
    setTimeout(() => {
      setActiveIntegration(key);
      setFadeKey(key);
    }, 120); // quick fade out/in
  };

  const renderIntegration = () => {
    switch (activeIntegration) {
      case 'meta':
        return <MetaAdsIntegration />;
      case 'google':
        return <GoogleAdsIntegration />;
      case 'twitter':
        return <TwitterAdsIntegration />;
      default:
        return null;
    }
  };

  const active = integrations.find(i => i.key === activeIntegration);

  return (
    <div style={{ display: "flex", minHeight: "100vh"  }}>
      
      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" , marginTop: "20px" }}>
        <div className="sectionContainer">
          <SectionTop>
            <TabBar
              activeTab="INTEGRATIONS"
              tabs={[
                {
                  id: "INTEGRATIONS",
                  label: "Integrations",
                  bgColor: "#fff",
                  fontColor: "#000",
                  path: "/admin/integrations",
                },
              ]}
            />
          </SectionTop>
          <section style={{ flex: 1, display: "flex", position: "relative"  }}>
            {/* Floating sidebar inside the page */}
            <Paper
              elevation={4}
              sx={{
                width: 220,
                marginTop: "100px",
                minHeight: 200,
                borderRadius: 3,
                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                bgcolor: '#fff',
                p: 2,
                mt: 3,
                ml: 2,
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >

              <List sx={{ width: '100%' , marginTop: "20px"  }}>
                {integrations.map((item) => (
                  <Tooltip title={item.tooltip} placement="right" arrow key={item.key}>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={activeIntegration === item.key}
                        onClick={() => handleTabChange(item.key)}
                        sx={{
                          borderRadius: 2,
                          my: 0.5,
                          mx: 1,
                          transition: 'background 0.2s',
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                ))}
              </List>
            </Paper>
            {/* Main integration content, with left margin to accommodate the floating sidebar */}
            <Box
              component="main"
              sx={{
                flex: 1,
                p: { xs: 1, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: 500,
                ml: 4, // margin-left for the sidebar
                width: "100%",
                marginTop: "20px",
                transition: "margin-left 0.2s",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  width: '100%',
                  maxWidth: 900,
                  minHeight: 420,
                  p: { xs: 2, sm: 4 },
                  mt: 2,
                  borderRadius: 4,
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  {active?.icon}
                  <Typography variant="h5" sx={{ ml: 1, fontWeight: 600 }}>
                    {active?.label}
                  </Typography>
                </Box>
                <Fade in={!!fadeKey} timeout={300}>
                  <Box>
                    {renderIntegration()}
                  </Box>
                </Fade>
              </Paper>
            </Box>
          </section>
        </div>
      </div>
    </div>
  );
}

export default IntegrationContainer;
