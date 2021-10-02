import React, {useRef, useState, useEffect} from "react";
import {Form, Button, Card, Container, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery'
import './Home.css';
import moment from 'moment';
import ProgressBar from "@ramonak/react-progress-bar";
require('dotenv').config();

export default function Home() {

  // Use Ref
  const amountRef = useRef();

  // Use State
  const [sport, setSport] = useState("");
  const [sportDisplay, setSportDisplay] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(-1);
  const [bookArray, setBookArray] = useState([]);
  const [gameArrayDropdown, setGameArrayDropdown] = useState([]);
  const [game, setGame] = useState("");
  const [book, setBook] = useState({index:0, title: "Book"});
  const [gameItem, setGameItem] = useState({index:-1, title: "Game"});
  const [namesList, setNamesList] = useState({});
  const [market, setMarket] = useState("");
  const [outcome, setOutcome] = useState("");
  const [moneyline, setMoneyline] = useState("");
  const [spread, setSpread] = useState("");
  const [totals, setTotals] = useState("");
  const [amount, setAmount] = useState("");
  const [completed, setCompleted] = useState(0);
  const [slotContainer_className, setSlotContainer_className] = useState("slots-container visible");

  var baseUrl = "https://api.the-odds-api.com";

  var marketArray = [];

  const NFL_Teams = {"Arizona Cardinals":"ARI", "Atlanta Falcons":"ATL", "Baltimore Ravens":"BAL",
                    "Buffalo Bills":"BUF", "Carolina Panthers":"CAR", "Dallas Cowboys":"DAL",
                    "Cincinnati Bengals":"CIN", "Cleveland Browns":"CLE", "Chicago Bears":"CHI",
                    "Denver Broncos":"DEN", "Detroit Lions":"DET", "Green Bay Packers":"GB",
                    "Houston Texans":"HOU", "Indianapolis Colts":"IND", "Jacksonville Jaguars":"JAX",
                    "Kansas City Chiefs":"KC", "Miami Dolphins":"MIA", "Minnesota Vikings":"MIN",
                    "New England Patriots":"NE", "New Orleans Saints":"NO", "New York Giants":"NYG",
                    "New York Jets": "NYJ", "Las Vegas Raiders":"LV", "Philadelphia Eagles":"PHI",
                    "Pittsburgh Steelers":"PIT", "Los Angeles Chargers":"LAC", "San Francisco 49ers":"SF",
                    "Seattle Seahawks":"SEA", "Los Angeles Rams":"LAR", "Tampa Bay Buccaneers":"TB",
                    "Tennessee Titans":"TEN", "Washington Football Team":"WAS"
                    };
  
  const MLB_Teams = {"Arizona Diamondbacks": "ARI",	"Atlanta Braves":	"ATL", "Baltimore Orioles": "BAL",
                    "Boston Red Sox":	"BOS", "Chicago White Sox": "CWS", "Chicago Cubs":	"CHC",
                    "Cincinnati Reds":	"CIN", "Cleveland Indians": "CLE", "Colorado Rockies":	"COL",
                    "Detroit Tigers":	"DET", "Houston Astros":	"HOU", "Kansas City Royals":	"KC",
                    "Los Angeles Angels":	"ANA", "Los Angeles Dodgers": "LAD", "Miami Marlins": "MIA",
                    "Milwaukee Brewers": "MIL", "Minnesota Twins": "MIN", "New York Mets": "NYM",
                    "New York Yankees":	"NYY", "Oakland Athletics": "OAK", "Philadelphia Phillies": "PHI",	
                    "Pittsburgh Pirates":	"PIT", "San Diego Padres":	"SD", "San Francisco Giants":	"SF",
                    "Seattle Mariners":	"SEA", "St. Louis Cardinals": "STL", "Tampa Bay Rays":	"TB",
                    "Texas Rangers": "TEX", "Toronto Blue Jays": "TOR", "Washington Nationals":	"WAS"
                    }

  const NBA_Teams = {"Boston Celtics": "BOS", "Brooklyn Nets": "BKN", "New York Knicks": "NY",
                    "Philadelphia 76ers": "PHI", "Toronto Raptors": "TOR", "Golden State Warriors": "GS",    
                    "Los Angeles Clippers": "LAC", "Los Angeles Lakers": "LAL", "Phoenix Suns": "PHX",
                    "Sacramento Kings": "SAC", "Chicago Bulls": "CHI", "Cleveland Cavaliers": "CLE",
                    "Detroit Pistons": "DET", "Indiana Pacers": "IND", "Milwaukee Bucks": "MIL",
                    "Dallas Mavericks": "DAL", "Houston Rockets": "HOU", "Memphis Grizzlies": "MEM",
                    "New Orleans Pelicans": "NO", "San Antonio Spurs": "SA", "Atlanta Hawks": "ATL",
                    "Charlotte Hornets": "CHA", "Miami Heat": "MIA", "Orlando Magic": "ORL",
                    "Washington Wizards": "WSH", "Denver Nuggets": "DEN", "Minnesota Timberwolves": "MIN",
                    "Oklahoma City Thunder": "OKC", "Portland Trail Blazers": "POR", "Utah Jazz": "UTA"
                  }
          
  const Market_Names = {"h2h": "Moneyline", "spreads": "Spread", "totals": "Total"};

  const Sport_Names = {"americanfootball_nfl": "Football - NFL", "baseball_mlb": "Baseball - MLB", "basketball_nba": "Basketball - NBA"}

//******************** GAME SLOT ANIMATION ****************** */
  function buildSlotItemGame (text) {
    return $('<div>').addClass('slottt-machine-recipe__item_game').text(text);
  }

function buildSlotContentsGame ($container, itemArray) {
  var $items = itemArray.map(buildSlotItemGame);
  $container.append($items);
}

function popPushNItemsGame ($container, n) {
    var $children = $container.find('.slottt-machine-recipe__item_game');
    $children.slice(0, n).insertAfter($children.last());

    if (n === $children.length) {
      popPushNItemsGame($container, 1);
    }
}

function rotateContentsGame ($container, n) {
    setTimeout(function () {
      popPushNItemsGame($container, n);
      $container.css({top: 0});
    }, 300);   
}
  
function animateGame(randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container_game');
  var wordIndex = randNum;
  $wordbox.animate({top: -wordIndex*150}, 500, 'swing', function () {
    rotateContentsGame($wordbox, wordIndex);
  });
}

function spinGame(itemArray, randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container_game');
  buildSlotContentsGame($wordbox, itemArray);
  buildSlotContentsGame($wordbox, itemArray);
  buildSlotContentsGame($wordbox, itemArray);
  buildSlotContentsGame($wordbox, itemArray);
  setInterval(animateGame(randNum), 2000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
}

//******************** MARKET SLOT ANIMATION ****************** */
function buildSlotItemMarket (text) {
  return $('<div>').addClass('slottt-machine-recipe__item_market').text(Market_Names[text]);
}

function buildSlotContentsMarket ($container, itemArray) {
  var $items = itemArray.map(buildSlotItemMarket);
  $container.append($items);
  }

function popPushNItemsMarket ($container, n) {
  var $children = $container.find('.slottt-machine-recipe__item_market');
  $children.slice(0, n).insertAfter($children.last());

  if (n === $children.length) {
    popPushNItemsMarket($container, 1);
  }
}

function rotateContentsMarket ($container, n) {
  setTimeout(function () {
    popPushNItemsMarket($container, n);
    $container.css({top: 0});
  }, 300);
}

function animateMarket(randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container_market');
  var wordIndex = randNum;
  $wordbox.animate({top: -wordIndex*150}, 1000, 'swing', function () {
    rotateContentsMarket($wordbox, wordIndex);
  });
}

function spinMarket(itemArray, randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container_market');
  buildSlotContentsMarket($wordbox, itemArray);
  buildSlotContentsMarket($wordbox, itemArray);
  buildSlotContentsMarket($wordbox, itemArray);
  buildSlotContentsMarket($wordbox, itemArray);
  setInterval(animateMarket(randNum), 1500);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
}

//******************** OUTCOME SLOT ANIMATION ****************** */
function buildSlotItemOutcome (text) {
  return $('<div>').addClass('slottt-machine-recipe__item_outcome').text(text);
}

function buildSlotContentsOutcome ($container, itemArray) {
  var $items = itemArray.map(buildSlotItemOutcome);
  $container.append($items);
}

function popPushNItemsOutcome ($container, n) {
  var $children = $container.find('.slottt-machine-recipe__item_outcome');
  $children.slice(0, n).insertAfter($children.last());

  if (n === $children.length) {
    popPushNItemsOutcome($container, 1);
  }
}

function rotateContentsOutcome ($container, n) {
  setTimeout(function () {
    popPushNItemsOutcome($container, n);
    $container.css({top: 0});
  }, 300);
}

function animateOutcome(randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container_outcome');
  var wordIndex = randNum;
  $wordbox.animate({top: -wordIndex*150}, 2000, 'swing', function () {
    rotateContentsOutcome($wordbox, wordIndex);
  });
}

function spinOutcome(itemArray, randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container_outcome');
  buildSlotContentsOutcome($wordbox, itemArray);
  buildSlotContentsOutcome($wordbox, itemArray);
  buildSlotContentsOutcome($wordbox, itemArray);
  buildSlotContentsOutcome($wordbox, itemArray);
  buildSlotContentsOutcome($wordbox, itemArray);
  buildSlotContentsOutcome($wordbox, itemArray);
  setInterval(animateOutcome(randNum), 2000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
}

function removeElementsByClass(className){
  const elements = document.getElementsByClassName(className);
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

// Get array of selected markets for API Call
function getMarkets() {
  if (moneyline !== "") {
    marketArray.push(moneyline);
  }
  if (spread !== "") {
    marketArray.push(spread);
  }
  if (totals !== "") {
    marketArray.push(totals);
  }
  if (moneyline === "" && spread === "" && totals === "") {
    marketArray = ["h2h,spreads,totals"];
  }
  return marketArray;
}

// Handle Form Submit
  async function handleSubmit(e) {
      e.preventDefault();

      var game_randNum;
      var market_randNum;
      var outcome_randNum;

      if (error === "") {
        // Reset Slot Contents
        if (document.getElementsByClassName('slottt-machine-recipe__item_game').length !== 0) {
          removeElementsByClass('slottt-machine-recipe__item_game');
        }
        if (document.getElementsByClassName('slottt-machine-recipe__item_market').length !== 0) {
          removeElementsByClass('slottt-machine-recipe__item_market');
        }
        if (document.getElementsByClassName('slottt-machine-recipe__item_outcome').length !== 0) {
          removeElementsByClass('slottt-machine-recipe__item_outcome');
        }
        
        setLoading(1);

        // Set entered bet amount
        setAmount(amountRef.current.value);
        setSportDisplay(sport);

        setSlotContainer_className("slots-container visible fade-out");
        setCompleted(0)
        setInterval(() => setCompleted(completed + 100), 10);

        // API Call
        axios({
          method: 'get',
          url: baseUrl + `/v4/sports/${sport}/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us&markets=${getMarkets().toString()}&oddsFormat=american`,
        })
        .then(res => {
            game_randNum = (Math.floor(Math.random() * res.data.length));
            market_randNum = (Math.floor(Math.random() * res.data[game_randNum].bookmakers[book.index].markets.length));
            outcome_randNum = (Math.floor(Math.random() * res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes.length));
            
            setLoading(0);
            

            // Set arrays
            var gameArray = res.data.map(function(game) {
              return `${game.away_team} at ${game.home_team}`;
            });

            var marketArray = res.data[game_randNum].bookmakers[book.index].markets.map(function(market) {
              return `${market.key}`;
            });

            var outcomeArray = res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes.map(function(outcome) {
              return `${outcome.name}`;
            });

            // Determine if a specific game was selected from the dropdown
            if (gameItem.index === -1){
              setGame(res.data[game_randNum]);
              spinGame(gameArray, game_randNum);
              setMarket(res.data[game_randNum].bookmakers[book.index].markets[market_randNum]);
              setOutcome(res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes[outcome_randNum]);
            } else {
              setGame(res.data[gameItem.index]);
              spinGame(gameArray, gameItem.index);
              setMarket(res.data[gameItem.index].bookmakers[book.index].markets[market_randNum]);
              setOutcome(res.data[gameItem.index].bookmakers[book.index].markets[market_randNum].outcomes[outcome_randNum]);
              outcomeArray = res.data[gameItem.index].bookmakers[book.index].markets[market_randNum].outcomes.map(function(outcome) {
                return `${outcome.name}`;
              });
            }

            // Spin slot machine animation
            spinMarket(marketArray, market_randNum);
            spinOutcome(outcomeArray, outcome_randNum);
        })
        .catch(function() {
          setError("Unable to generate bet");
        });

        // Reset state after submit
        $('input[type=checkbox]').prop('checked',false);
        setBook({index:0, title: "Book"});
        setGameItem({index:-1, title: "Game"});
        setMoneyline("");
        setSpread("");
        setTotals("");

        // reset fields
        e.target.reset();
      }
    }

  // Sport radio buttons
  const handleChange = e => {
    var sport_radio = e.target.value;
    setSport(e.target.value);
    if (e.target.value === "americanfootball_nfl") {
      setNamesList(NFL_Teams);
    } else if (e.target.value === "baseball_mlb") {
      setNamesList(MLB_Teams);
    } else if (e.target.value === "basketball_nba") {
      setNamesList(NBA_Teams);
    }
    axios({
      method: 'get',
      url: baseUrl + `/v4/sports/${sport_radio}/odds?regions=us&oddsFormat=american&apiKey=${process.env.REACT_APP_ODDS_API_KEY}`,
    })
    .then(res => {
      setBookArray(res.data[0].bookmakers);
      setGameArrayDropdown(res.data);
    }).catch(function() {
      setError("Unable to generate books");
    });
  };

  // Bet type checkboxes
  const handleMLSelect = e => {  
      if ($('#moneyline').is(":checked")) {
        setMoneyline(e.target.value);
      } else {
        setMoneyline("");
      }   
  };

  const handleSpreadSelect = e => {
    if ($('#spread').is(":checked")) {
        setSpread(e.target.value);
      } else {
        setSpread("");
      } 
  };

  const handleTotalSelect = e => {
    if ($('#totals').is(":checked")) {
        setTotals(e.target.value);
      } else {
        setTotals("");
      } 
  };

  const borderStyles = {
    borderRadius: "10px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)"
  }

  return (
    <>
    <Container
            className="d-flex justify-content-center container"
            style={{ minHeight: "100vh", paddingTop: "30px"}}
        >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          { success && 
          <div className="alert alert-success">{success}</div> }
          { error && 
          <div className="alert alert-danger">{error}</div> }
            <div style={ borderStyles }>
                <Card.Body>
                    <h2 className="text-center heading">Sports Bet Roulette</h2>
                    <div className="text-center mb-4 subheading">Randomly Generate a Bet</div>
                    <hr/>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="amount" className="input-icon">
                            <Form.Label>Amount</Form.Label>
                            <i>$</i>
                            <Form.Control type="number" min="1" step="any" placeholder="0.00" ref={amountRef} required/>
                        </Form.Group>
                        <div className="row">
                          <div className="col">
                            <Form.Group id="type">
                            <Form.Label>Sport</Form.Label>
                              <Form.Check 
                                type={'radio'}
                                id={'Football'}
                                value={'americanfootball_nfl'}
                                label={'Football'}
                                name={'sport'}
                                className="checkbox"
                                onChange={handleChange}
                                required
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Basketball'}
                                value={'basketball_nba'}
                                label={'Basketball'}
                                name={'sport'}
                                className="checkbox"
                                onChange={handleChange}
                                required
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Baseball'}
                                value={'baseball_mlb'}
                                label={'Baseball'}
                                name={'sport'}
                                className="checkbox"
                                onChange={handleChange}
                                required
                              />
                          </Form.Group>
                          </div>
                          <div className="col">
                            <Form.Group>
                              <Form.Label>Bets</Form.Label>
                                <Form.Check 
                                  id={'moneyline'}
                                  value={'h2h'}
                                  label={'Moneyline'}
                                  name={'moneyline'}
                                  className="checkbox"
                                  onChange={handleMLSelect}
                                />
                                <Form.Check 
                                  id={'spread'}
                                  value={'spreads'}
                                  label={'Spread'}
                                  name={'spreads'}
                                  className="checkbox"
                                  onChange={handleSpreadSelect}
                                />
                                <Form.Check 
                                  id={'totals'}
                                  value={'totals'}
                                  label={'Totals'}
                                  name={'totals'}
                                  className="checkbox"
                                  onChange={handleTotalSelect}
                                />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          {/* **************************** TEAM DROPDOWN *************************** */}
                          <div className="col">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic" className="button btn-danger" style={{marginBottom: "20px"}}>
                                {gameItem.title}
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{overflow: "auto", maxHeight: "200px"}}>
                              <Dropdown.Item onClick={() => {setGameItem({index: -1, title: "Any"})}}>Any</Dropdown.Item>
                                {gameArrayDropdown.map(gameEntry =>
                                    <Dropdown.Item onClick={() => {setGameItem({index: gameArrayDropdown.indexOf(gameEntry), title: `${namesList[gameEntry.away_team]} @ ${namesList[gameEntry.home_team]}`})}}>{`${namesList[gameEntry.away_team]} @ ${namesList[gameEntry.home_team]}`}</Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown> 
                          </div>

                          {/* **************************** BOOK DROPDOWN *************************** */}
                          <div className="col">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic" className="button btn-danger" style={{marginBottom: "20px"}}>
                                {book.title}
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{overflow: "auto", maxHeight: "200px"}}>
                              <Dropdown.Item onClick={() => {setBook({index: 0, title: "Any"})}}>Any</Dropdown.Item>
                                {bookArray.map(bookName =>
                                  <Dropdown.Item key={bookName.key} onClick={() => {setBook({index: bookArray.indexOf(bookName), title: bookName.title})}}>{bookName.title}</Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <Button className="w-100 button" type="submit">Bet!</Button>
                    </Form>
                </Card.Body>
            </div>
            {loading === 1 && <ProgressBar height="5px" isLabelVisible={false} bgColor="#cc0000" completed={completed}/> }
            <div className="wrapper">
              <div className={slotContainer_className}>
                <div className="slottt-machine-recipe_game">
                  <div className="slottt-machine-recipe__mask_game  slot-container" id="wordbox">
                    <div className="slottt-machine-recipe__items_container_game recipe_if" id="slot_items_list"></div>
                  </div>
                </div>
                <div className="slottt-machine-recipe_market">
                  <div className="slottt-machine-recipe__mask_market  slot-container" id="wordbox">
                    <div className="slottt-machine-recipe__items_container_market recipe_if" id="slot_items_list"></div>
                  </div>
                </div>
                <div className="slottt-machine-recipe_outcome">
                  <div className="slottt-machine-recipe__mask_outcome  slot-container" id="wordbox">
                    <div className="slottt-machine-recipe__items_container_outcome recipe_if" id="slot_items_list"></div>
                  </div>
                </div>
              </div>
              {loading===0 && 
              <div id="bet-container" className="bet-container fade-in hidden">
                <div>
                  <div>Risk ${parseFloat(amount).toFixed(2)} / To Win ${outcome.price > 0 ? (outcome.price/100 * amount).toFixed(2) : ((100/Math.abs(outcome.price)) * amount).toFixed(2)} / Odds {outcome.price > 0 ? `+${outcome.price}` : outcome.price} </div>
                </div>
                <ul>
                  <li>
                    <div>
                      <hr/>
                      <span className="market">{Market_Names[market.key]} - </span>
                      <span className="market">{outcome.name} {(market.key === "spreads" && outcome.point > 0) ?  `+${outcome.point}` : outcome.point} ({outcome.price > 0 ? `+${outcome.price}` : outcome.price})</span>
                      <div>{moment(game.commence_time).format("M/D/YY")}</div>
                      <hr/>
                    </div>
                    <div>
                      <span> </span>
                      <div>{game.away_team} @ {game.home_team} </div>
                      <span>{Sport_Names[sportDisplay]}</span> 
                      <div>{moment(game.commence_time).format("MMM Do YYYY h:mm a")}</div>
                    </div>
                  </li>
                </ul>
              </div>
              }
            </div>
    </div>
    </Container>
    </>
  )
}