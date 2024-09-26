import React from 'react';

// eslint-disable-next-line react/prop-types
const VehicleSearch = ({setSearchFilter, executeSearch, searchFilter}) => {

    return (
        <div>
            Search
            <input
                type="text"
                onChange={(e) => setSearchFilter(e.target.value)}
            />
            <button onClick={() => executeSearch({variables: {vin: searchFilter}})}>OK</button>
        </div>
    );
}

export default VehicleSearch;