import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useDispatch } from 'react-redux'
import { activeUser, allNegotiateData, investedUsers, loanRequestUsers } from '../redux/slices/auth';
function GraphCharts({platformDetail}) {
  const [allUser , setAllUser] = useState(null);
  const [allInvestor , setAllInvestor] = useState(null);
  const [allborrower , setAllBorrower] = useState(null);
const dispatch = useDispatch();
  useEffect(()=>{
    const getSummary = async()=>{
      const user = await dispatch(activeUser());
      const userLength = user.users.length;
      setAllUser(user.users);
      const investor = await dispatch(investedUsers());
      setAllInvestor(investor.investorDetail)
      const borrower = await dispatch(loanRequestUsers());
      setAllBorrower(borrower.loanDetail)
      const loanApproval = borrower.loanDetail.reduce((count , item)=> {return item.state==='Approved'?count+1:count},0)
      const percentageApproval = ((loanApproval/borrower.loanDetail.length)*100).toFixed(2);
      setLoanApproval((prevState)=>({
        ...prevState, series: [percentageApproval]
      }))
      const investorNegotiation = await dispatch(allNegotiateData());
      const successNegotiation = investorNegotiation.negotiateDetail.reduce((count,item)=>{return item.negotiate_status==="Approved"?count+1:count},0)
      const percentageSuccessNegotiation = ((successNegotiation/investorNegotiation.negotiateDetail.length)*100).toFixed(2);
      setsuccessNegotiation(prevState=>({
        ...prevState,series:[percentageSuccessNegotiation]
      }))


      const totalInvestment = investor.investorDetail.reduce((sum, item) => {
        const numericAmount = Number(item.amount.replace(/₹\s*/, "")); // Remove ₹ and convert to number
        return sum + numericAmount;
    }, 0);

    // Get today's date in 'DD MMM' format
    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}`;

    // Update the chart data with new totalInvestment and date
    setTotalInvestment((prevState) => ({
        ...prevState,
        series: [{
            ...prevState.series[0],
            data: Array.isArray(prevState.series[0].data) // Check if data is an array
                ? [...prevState.series[0].data, totalInvestment]
                : [totalInvestment], // If not, initialize with the new value
        }],
        options: {
            ...prevState.options,
            xaxis: {
                ...prevState.options.xaxis,
                categories: Array.isArray(prevState.options.xaxis.categories) // Check if categories is an array
                    ? [...prevState.options.xaxis.categories, formattedDate]
                    : [formattedDate], // If not, initialize with the new date
            }
        }
    }));


        
      
      setState((prevState) => ({
        ...prevState,
        series: [user.users.length, investor.investorDetail.length, borrower.loanDetail.length], // Example for Total Investment
    }));
    const data = {
      userLength,
      loanApproval,
      totalInvestment,
      successNegotiation
    }
    platformDetail(data)
    }
    getSummary();
  },[])
  
  
  
  const [state, setState] = React.useState({
          
    series: [0,0,0],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Registered User', 'Investors', 'Borrowers', 'Total Investment'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
            
          }
        }
      }],
    legend: {
                labels: {
                    colors: ['#FF5733', '#33FF57', '#3357FF', '#F333FF'], // Custom label colors
                    useSeriesColors: false, // Set this to false to use specific colors
                }
            },
            dataLabels: {
                style: {
                    colors: ['#FF5733', '#33FF57', '#3357FF', '#F333FF'], // Custom label colors
                }
            }
        },
    });

    // Successful LoanApproval

    const [loanApproval, setLoanApproval] = React.useState({
          
      series: [70],
            options: {
              chart: {
                height: 350,
                type: 'radialBar',
              },
              plotOptions: {
                radialBar: {
                  hollow: {
                    size: '70%',
                  },
                  dataLabels: {
                    name: {
                        show: true,
                        color: '#FF5733', // Color for "Loan Approval"
                        fontSize: '20px',
                    },
                    value: {
                        show: true,
                        color: '#33FF57', // Color for the value "70"
                        fontSize: '20px',
                    },
                },
                },
              },
              labels: ['Loan Approval'],
            },
          
          
        });

        // total Successfulnegotiation
        const [successNegotiation, setsuccessNegotiation] = React.useState({
        series: [67],
            options: {
              chart: {
                height: 350,
                type: 'radialBar',
                offsetY: -10
              },
              plotOptions: {
                radialBar: {
                  startAngle: -135,
                  endAngle: 135,
                  dataLabels: {
                    name: {
                      fontSize: '16px',
                      color: '#F333FF',
                      offsetY: 120
                    },
                    value: {
                      offsetY: 76,
                      fontSize: '22px',
                      color: '#33FF57',
                      formatter: function (val) {
                        return val + "%";
                      }
                    }
                  }
                }
              },
              fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.15,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 65, 91]
                },
              },
              stroke: {
                dashArray: 4
              },
              labels: ['Successful Negotiation'],
            },
          
          
        });

        //Total Investment

        

        const [totalInvestment, setTotalInvestment] = React.useState({
          
          
          series: [{
            name: "Investment Over Time",
            data: [], // Initialize as an empty array
            
        }],
        options: {
            chart: {
                type: 'area',
                height: 350,
                zoom: {
                    enabled: false
                }
            },
            
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Total Investment Over Time',
                align: 'left',
                style: {
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ff5978' // Title color (e.g., Tomato red)
              }
            },
            xaxis: {
                categories: [], // Initialize as an empty array
                labels: {
                  style: {
                      colors: '#4682b4', // X-axis labels color (e.g., Steel Blue)
                      fontSize: '12px', // Font size for X-axis labels
                  }
              }
            },
            yaxis: {
              labels: {
                  style: {
                      colors: '#32cd32', // Y-axis labels color (e.g., Lime Green)
                      fontSize: '12px', // Font size for Y-axis labels
                  }
              }
          }
            
        }
    });

  return (
      
        <div className='flex flex-wrap items-center justify-center h-full w-full gap-36 text-black'>
          
          <div id="chart" >
              <ReactApexChart options={state.options} series={state.series} type="pie"  width={450} />
            </div>
          <div id="html-dist"></div>
          <div className='text-white'>
                <div id="chart" >
                <ReactApexChart options={loanApproval.options} series={loanApproval.series} type="radialBar" height={350} />
              </div>
              </div>
            <div id="html-dist"></div>
            
            <div id="chart" >
                <ReactApexChart options={successNegotiation.options} series={successNegotiation.series} type="radialBar" height={350} />
              </div>
            <div id="html-dist"></div>
            <div id="chart" >
                <ReactApexChart options={totalInvestment.options} series={totalInvestment.series} type="area" height={350}  />
              </div>
            <div id="html-dist"></div>
        </div>
      );
    }

export default GraphCharts