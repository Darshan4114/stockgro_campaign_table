import { useState, useEffect, useCallback } from "react";

import styl from "./styles/css/App.module.css";

import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import TableContainer from "@mui/material/TableContainer";

import jsonData from "./data";

function App() {
  const [page, setPage] = useState({ pgno: 1 });
  const [pageList, setPageList] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [campaignList, setCampaignList] = useState(jsonData.slice(0, 10));

  const headers = Object.keys(jsonData[0]).filter((h) => h !== "_id");

  useEffect(() => {
    const pageList = Array(Math.floor(jsonData.length / 10))
      .fill("1")
      .map((page, idx) => ({ pgno: idx + 1 }));
    setPageList(pageList);
  }, []);

  const handlePageChange = (e, pgno) => {
    setPage({ pgno });
    setSearchInputValue("");
    setCampaignList(jsonData.slice((pgno - 1) * 10, (pgno - 1) * 10 + 10));
  };

  const debounceSearchInput = debounce((val) => {
    //To demo the debounce
    console.log("Running search: ", val);
    if (val) {
      const filteredCampaignList = jsonData
        .filter((campaign) => {
          return campaign.name.toLowerCase().includes(val);
        })
        .slice(0, 10);
      setCampaignList(filteredCampaignList);
    } else {
      setCampaignList(
        jsonData.slice((page.pgno - 1) * 10, (page.pgno - 1) * 10 + 10)
      );
    }
  });

  //Search function
  const handleSearchInput = useCallback(debounceSearchInput, []);

  //Running search when input changes
  useEffect(() => {
    handleSearchInput(searchInputValue);
  }, [handleSearchInput, searchInputValue]);

  //Function to debounce the search input
  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  return (
    <div className={styl.app}>
      <main>
        <TextField
          id="searchBar"
          label="Search by name"
          variant="outlined"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
        />
        <TableContainer className={styl.table} component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            size="small"
            aria-label="Campaign table"
          >
            <TableHead>
              <TableRow>
                {headers.length > 0 &&
                  headers.map((header) => (
                    <TableCell key={header}>
                      {header.replace(/^\w/, (c) => c.toUpperCase())}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignList.length > 0 &&
                campaignList.map((campaign) => (
                  <TableRow
                    key={campaign._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {headers.length > 0 &&
                      headers.map((header) => (
                        <TableCell key={`${header}_${campaign._id}`}>
                          {campaign[header]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          className={styl.pagination}
          count={pageList.length}
          color="secondary"
          onChange={handlePageChange}
        />
      </main>
    </div>
  );
}

export default App;
