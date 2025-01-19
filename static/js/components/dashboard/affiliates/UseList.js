import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Link,
  TablePagination,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

const paginate = (array, page_size, page_number) => {
  return array.slice(
    page_number * page_size,
    page_number * page_size + page_size
  );
};

const UseList = (props) => {
  const { getCustomer, customer, ...other } = props;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(customer.people_used.length);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  return (
    <Card {...other}>
      <CardHeader title="Code Users" />
      <Divider />
      <Table>
        <TableBody>
          {paginate(customer.people_used, limit, page).map((steamid) => (
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  SteamID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  <Link
                    color="inherit"
                    component={RouterLink}
                    to={`/customers/${steamid}`}
                    variant="subtitle2"
                  >
                    {steamid}
                  </Link>
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

UseList.propTypes = {
  customer: PropTypes.any,
};

export default UseList;
