import React, { useState, useEffect } from 'react';
import { 
  MenuItem, 
  FormControl, 
  Select, 
  Card, 
  CardContent
} from '@material-ui/core';
import InfoBox from './InfoBox';
import './App.css';
import Table from "./Table";  
import { sortData } from './util'
import  LineGraph from "./LineGraph";
import Map from "./Map";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from './util';

  function App() {
    const [countries, setCountries] = useState([]);
    const [country,setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [mapCenter,setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
    const [mapZoom,setMapZoom] = useState(3);
    const [mapCountries,setMapCountries] = useState([]); 
    const [color, setColor] = useState('red');
  

    useEffect(() => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
        });
    }, []);



    useEffect(()  =>{
      //  sends a requests ,wait for it and do something with the info

      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,//United States ,United Kingdom,Canada
              value: country.countryInfo.iso2 //UK ,USA,FR
            }));
            
            const sortedData = sortData(data);
            setTableData(sortedData);
            setCountries(countries);
            setMapCountries(data);
        });
      };

      getCountriesData();

  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };


  return (
    <div className="app">
    <div className="app_left">
    <div className="app_header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app_dropdown">
      <Select variant="outlined" onChange={onCountryChange} value ={country}>
        <MenuItem value='worldwide'>Worldwide</MenuItem>
          {/*Loop through all the countries and show various dropdown,show various options*/}
          {
            countries.map((country )=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>

            ))}
         
        </Select>
    </FormControl>
    </div>

    <div className="app_stats">
    <InfoBox
              active = {casesType === 'cases'}
              onClick = {(e) => {
                setCasesType('cases') 
                setColor('red')
              } }
              title="Coronavirus cases"
              total = {prettyPrintStat(countryInfo.cases)}
              cases = {prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
              active = {casesType === 'recovered'}
              onClick = {(e) => {
                setCasesType('recovered') 
                setColor('green')
              } }
              title="Recovered"
              total = {prettyPrintStat(countryInfo.recovered)}
              cases = {prettyPrintStat(countryInfo.todayRecovered)}
          />

          <InfoBox
              active = {casesType === 'deaths'}
              onClick = {(e) => {
                setCasesType('deaths') 
                setColor('lightcoral')
              } }
              title="Coronavirus deaths"
              total = {prettyPrintStat(countryInfo.deaths)}
              cases = {prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>

        <Map 
            casesType = {casesType}
            center = {mapCenter}
            zoom = {mapZoom}
            countries = {mapCountries}
            color = {color}
        />
        </div>
        <Card className="app__right">
              <CardContent>
                  <h3>Live cases by country</h3>
                  <Table countries = {tableData}/>
                  <h3 style = {{paddingTop: '25px', paddingBottom: '25px'}}>Worldwide new {casesType}</h3>
                  <LineGraph casesType = {casesType} color = {color}/>
              </CardContent>
        </Card>
    </div>
  );
}

export default App;