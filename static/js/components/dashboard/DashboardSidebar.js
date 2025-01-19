import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Typography,
} from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import useAuth from "../../hooks/useAuth";
import ChartPieIcon from "../../icons/ChartPie";
import ChartSquareBarIcon from "../../icons/ChartSquareBar";
import FolderOpenIcon from "../../icons/FolderOpen";
import ShoppingBagIcon from "../../icons/ShoppingBag";
import UsersIcon from "../../icons/Users";
import Logo from "../Logo";
import NavSection from "../NavSection";
import Scrollbar from "../Scrollbar";
import Ban from "../../icons/Ban";

const sections = [
  {
    title: "Management",
    items: [
      {
        title: "Users",
        path: "/customers",
        icon: <UsersIcon fontSize="small" />,
      },
      {
        title: "Affiliates",
        path: "/affiliates",
        icon: <UsersIcon fontSize="small" />,
      },
      {
        title: "Bugged Deposit Offers",
        path: "/bugged",
        icon: <Ban fontSize="small" />,
      },
      /*{
        title: "Orders",
        icon: <FolderOpenIcon fontSize="small" />,
        path: "/orders",
        children: [
          {
            title: "List",
            path: "/orders",
          },
          {
            title: "Details",
            path: "/orders/1",
          },
        ],
      },
      {
        title: "Invoices",
        path: "/invoices",
        icon: <ReceiptIcon fontSize="small" />,
        children: [
          {
            title: "List",
            path: "/invoices",
          },
          {
            title: "Details",
            path: "/invoices/1",
          },
        ],
      },*/
    ],
  },
];

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40,
                }}
              />
            </RouterLink>
          </Box>
        </Hidden>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "background.default",
              borderRadius: 1,
              display: "flex",
              overflow: "hidden",
              p: 2,
            }}
          >
            <RouterLink to="/dashboard/account">
              <Avatar
                src={user.photo}
                sx={{
                  cursor: "pointer",
                  height: 48,
                  width: 48,
                }}
              />
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography color="textPrimary" variant="subtitle2">
                {user.name}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Your role: {user.role}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                "& + &": {
                  mt: 3,
                },
              }}
              {...section}
            />
          ))}
        </Box>
      </Scrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              width: 280,
            },
          }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              height: "calc(100% - 64px) !important",
              top: "64px !Important",
              width: 280,
            },
          }}
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default DashboardSidebar;
