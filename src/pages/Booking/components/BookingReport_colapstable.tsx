import React, { useState,Fragment } from "react";
import "../styles/table.css";

const data = [
  {
    company: "Alfreds Futterkiste",
    contact: "Maria Anders",
    country: "Germany"
  },
  {
    company: "Centro comercial Moctezuma",
    contact: "Maria Anders",
    country: "Mexico"
  }
];

const BookingReport = () => {
  const [state, setState] = useState(0);

  const handleClick = (index) => {
    const updatedState = data[index];

    if (updatedState.other) {
      delete updatedState.other;
      setState((pre) => {
        return pre + 1;
      });
    } else {
      updatedState.other = {
        description: "Hello there" //or data from api
      };
      setState((pre) => {
        return pre + 1;
      });
    }
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <Fragment key={`${index}${row.company}`}>
              <tr
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(index)}
              >
                <td>{row.company}</td>
                <td>{row.contact}</td>
                <td>{row.country}</td>
              </tr>
              {row.other ? (
                <tr>
                  <td colSpan={3}>{row.other.description}</td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingReport;