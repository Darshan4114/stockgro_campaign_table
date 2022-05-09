import { useState, useEffect } from "react";

import styl from "./styles/css/App.module.css";

import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";

import jsonData from "./data";

function App() {
  const [page, setPage] = useState(1);
  const [pageList, setPageList] = useState([]);
  const [campaignList, setCampaignList] = useState(jsonData.slice(0, 10));

  const headers = Object.keys(jsonData[0]).filter((h) => h !== "_id");

  useEffect(() => {
    const pageList = Array(Math.floor(jsonData.length / 10))
      .fill("1")
      .map((page, idx) => ({ pgno: idx + 1 }));
    console.log("pagelisyt=t ", pageList);
    setPageList(pageList);
  }, []);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    if (val) {
      const filteredCampaignList = jsonData.filter((campaign) => {
        return campaign.name.toLowerCase().includes(val);
      });
      setCampaignList(filteredCampaignList);
    } else {
      setCampaignList(jsonData);
    }
    console.log("searching for", val);
  };

  const handlePageChange = (pgno) => {
    const curr = jsonData.slice((pgno - 1) * 10, (pgno - 1) * 10 + 10);
    console.log("curr = ", pgno, curr, (pgno - 1) * 10, (pgno - 1) * 10 + 10);
    setCampaignList(curr);
  };

  return (
    <div className="App">
      <main>
        <input className={styl.searchBar} onChange={handleSearchInput} />
        <table>
          <thead>
            {headers.length > 0 && headers.map((header) => <th>{header}</th>)}
          </thead>
          <tbody>
            {campaignList.length > 0 &&
              campaignList.map((campaign) => (
                <tr key={campaign._id}>
                  {headers.length > 0 &&
                    headers.map((header) => <td>{campaign[header]}</td>)}
                </tr>
              ))}
          </tbody>
        </table>
        <div className={styl.pagination}>
          {pageList.length > 0 &&
            pageList.map((page) => (
              <button onClick={() => handlePageChange(page.pgno)}>
                {page.pgno}
              </button>
            ))}
        </div>
      </main>
    </div>
  );
}

export default App;
