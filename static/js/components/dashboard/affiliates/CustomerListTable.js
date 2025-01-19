import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
} from "@material-ui/core";
import ArrowRightIcon from "../../../icons/ArrowRight";
import PencilAltIcon from "../../../icons/PencilAlt";
import SearchIcon from "../../../icons/Search";
import Scrollbar from "../../Scrollbar";
import axios from "../../../lib/axios";
import useIsMountedRef from "../../../hooks/useIsMountedRef";

const tabs = [
  {
    label: "All",
    value: "all",
  },
];

const sortOptions = [
  {
    label: "Last Login (newest)",
    value: "last_login|desc",
  },
  {
    label: "Last Login (oldest)",
    value: "last_login|asc",
  },
  {
    label: "Role (lowest)",
    value: "role|desc",
  },
  {
    label: "Role (highest)",
    value: "role|asc",
  },
];

const CustomerListTable = (props) => {
  const { ...other } = props;
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const isMountedRef = useIsMountedRef();
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(10);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null,
  });

  const [customers, setCustomers] = useState([]);

  const getCustomers = useCallback(async () => {
    try {
      const [orderBy, criteria] = sort.split("|");
      const response = await axios.get(
        `/affiliates/all?page=${
          page + 1
        }&perPage=${limit}&search=${query}&sort=${orderBy}&criteria=${criteria}`
      );

      if (isMountedRef.current) {
        setCustomers(response.data.users);
        setTotal(response.data.numOfUsers);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, page, limit, query, sort]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  const handleTabsChange = (event, value) => {
    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: null,
      isProspect: null,
      isReturning: null,
    };

    if (value !== "all") {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setSelectedCustomers([]);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(
      event.target.checked ? customers.map((customer) => customer.id) : []
    );
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) =>
        prevSelected.filter((id) => id !== customerId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers =
    selectedCustomers.length > 0 && selectedCustomers.length < customers.length;
  const selectedAllCustomers = selectedCustomers.length === customers.length;

  return (
    <Card {...other}>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          m: -1,
          p: 2,
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: "100%",
            width: 500,
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={handleQueryChange}
            placeholder="Search customers"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            m: 1,
            width: 240,
          }}
        >
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      {enableBulkActions && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              backgroundColor: "background.paper",
              mt: "6px",
              position: "absolute",
              px: "4px",
              width: "100%",
              zIndex: 2,
            }}
          >
            <Checkbox
              checked={selectedAllCustomers}
              color="primary"
              indeterminate={selectedSomeCustomers}
              onChange={handleSelectAllCustomers}
            />
            <Button color="primary" sx={{ ml: 2 }} variant="outlined">
              Delete
            </Button>
            <Button color="primary" sx={{ ml: 2 }} variant="outlined">
              Edit
            </Button>
          </Box>
        </Box>
      )}
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllCustomers}
                    color="primary"
                    indeterminate={selectedSomeCustomers}
                    onChange={handleSelectAllCustomers}
                  />
                </TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Total Deposited</TableCell>
                <TableCell>Total Depositors</TableCell>
                <TableCell>Uses</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => {
                const isCustomerSelected = selectedCustomers.includes(
                  customer.id
                );

                return (
                  <TableRow
                    hover
                    key={customer.code}
                    selected={isCustomerSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isCustomerSelected}
                        color="primary"
                        onChange={(event) =>
                          handleSelectOneCustomer(event, customer.id)
                        }
                        value={isCustomerSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/affiliates/${customer.code}`}
                            variant="subtitle2"
                          >
                            {customer.code}
                          </Link>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.total_deposited.toFixed(2)}</TableCell>
                    <TableCell>{customer.total_depositors}</TableCell>
                    <TableCell>{customer.people_used.length}</TableCell>
                    <TableCell align="right">
                      <IconButton component={RouterLink} to="/customers/1/edit">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={`/affiliates/${customer.code}`}
                      >
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={total}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  );
};

export default CustomerListTable;
