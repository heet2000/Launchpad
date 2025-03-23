import * as React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Box } from '@mui/material';

// Styled components
const StyledCalendarContainer = styled(Box)(({ theme }) => ({
    padding: 0,
    height: '100%',
    width: '100%',
    '& .MuiPickersCalendarHeader-root': {
        height: '30px',
        '& .MuiPickersCalendarHeader-switchViewButton': {
            display: 'none'
        },
        '& .MuiPickersCalendarHeader-switchViewIcon': {
            display: 'none'
        },
        '& .MuiPickersArrowSwitcher-root': {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            '& button': {
                padding: '4px',
                color: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiSvgIcon-root': {
                    fontSize: '1.2rem',
                }
            }
        }
    },
    '& .MuiPickersCalendarHeader-label': {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.9)',
        textTransform: 'capitalize',
        margin: '0 8px',
        textAlign: 'center',
        flex: 1
    },
    '& .MuiDayCalendar-slideTransition': {
        maxHeight: '160px',
        overflow: 'hidden',
        '& .MuiDayCalendar-weekContainer': {
            margin: '13px 0',
            '& .MuiDayCalendar-week': {
                display: 'flex',
                justifyContent: 'space-around',
                '& .MuiPickersDay-root': {
                    margin: "0 40px",
                    width: '24px',
                    height: '24px',
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(106, 17, 203, 0.8)',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: 'rgba(106, 17, 203, 0.9)',
                        }
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                }
            }
        }
    },
    '& .MuiDayCalendar-header': {
        padding: '4px 0',
        '& .MuiDayCalendar-weekDayLabel': {
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 600,
            margin: "0 35px"
        }
    }
}));

const StyledDay = styled(PickersDay)`
  position: relative;
  border-radius: 50% !important;
  width: 24px;
  height: 24px;
  margin: 0 40px !important;
  padding: 0 !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.present {
    background: linear-gradient(135deg, #4caf50, #81c784) !important;
    color: white !important;
    font-weight: bold;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.6);
    }
  }
  
  &.leave {
    background: linear-gradient(135deg, #f44336, #e57373) !important;
    color: white !important;
    font-weight: bold;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.6);
    }
  }
  
  &.weekend {
    background: rgba(158, 0, 255, 0.3) !important;
    color: rgba(255, 255, 255, 0.8) !important;
    
    &:hover {
      background: rgba(158, 0, 255, 0.4) !important;
    }
  }
  
  &.future {
    background: rgba(255, 157, 0, 0.3) !important;
    color: rgba(255, 255, 255, 0.8) !important;
    
    &:hover {
      background: rgba(255, 157, 0, 0.4) !important;
    }
  }
  
  &.today {
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    font-weight: bold !important;
    color: rgba(255, 255, 255, 0.9);
  }

  &.Mui-selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
  }
`;

// Function to check if a day is a weekend (Saturday or Sunday)
function isWeekend(date) {
    const day = date.day();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function getRandomWeekdaysInMonth(date) {
    const daysInMonth = date.daysInMonth();
    const leaveDays = [];

    // Keep trying to add leave days until we have 3 unique weekday leave days
    while (leaveDays.length < 3) {
        const randomDay = getRandomNumber(1, daysInMonth);
        const randomDate = date.date(randomDay);

        // Only add the day if it's not a weekend and not already in the array
        if (!isWeekend(randomDate) && !leaveDays.includes(randomDay)) {
            leaveDays.push(randomDay);
        }
    }

    return leaveDays;
}

function fakeFetch(date, { signal }) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            const leaveDays = getRandomWeekdaysInMonth(date);
            resolve({ leaveDays });
        }, 500);

        signal.onabort = () => {
            clearTimeout(timeout);
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
}

const initialValue = dayjs();

function ServerDay(props) {
    const { leaveDays = [], day, outsideCurrentMonth, ...other } = props;

    const today = dayjs();

    // Check if the day is a weekend
    const isWeekendDay = isWeekend(day);

    // Check if the day is in the future
    const isFutureDay = day.isAfter(today, 'day');

    // Check if the day is marked as leave (one of the 3 random days)
    const isLeaveDay = !outsideCurrentMonth && !isWeekendDay && leaveDays.indexOf(day.date()) >= 0;

    // If not a weekend or leave day and not outside current month, it's a present day
    const isPresentDay = !outsideCurrentMonth && !isWeekendDay && !isLeaveDay && !isFutureDay && day.isBefore(today, 'day');

    const isToday = day.isSame(today, 'day');

    return (
        <StyledDay
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            className={`
                ${isPresentDay ? 'present' : ''} 
                ${isLeaveDay ? 'leave' : ''} 
                ${isWeekendDay ? 'weekend' : ''} 
                ${isFutureDay ? 'future' : ''}
                ${isToday ? 'today' : ''}
            `}
            sx={{
                opacity: outsideCurrentMonth ? 0.4 : 1
            }}
        />
    );
}

export default function DateCalendarServerRequest() {
    const requestAbortController = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [leaveDays, setLeaveDays] = React.useState([]);

    const fetchLeaveDays = (date) => {
        const controller = new AbortController();
        fakeFetch(date, {
            signal: controller.signal,
        })
            .then(({ leaveDays }) => {
                setLeaveDays(leaveDays);
                setIsLoading(false);
            })
            .catch((error) => {
                // ignore the error if it's caused by `controller.abort`
                if (error.name !== 'AbortError') {
                    throw error;
                }
            });

        requestAbortController.current = controller;
    };

    React.useEffect(() => {
        fetchLeaveDays(initialValue);
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, []);

    const handleMonthChange = (date) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort();
        }

        setIsLoading(true);
        setLeaveDays([]);
        fetchLeaveDays(date);
    };

    return (
        <StyledCalendarContainer>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    defaultValue={initialValue}
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: ServerDay,
                    }}
                    slotProps={{
                        day: {
                            leaveDays,
                        },
                    }}
                    sx={{
                        width: '100%',
                        height: '100%',
                        '& .MuiDayCalendar-weekDayLabel': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            margin: 0,
                            padding: 0
                        },
                        '& .MuiPickersDay-today': {
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                        },
                        '& .MuiPickersDay-dayOutsideMonth': {
                            color: 'rgba(255, 255, 255, 0.3)',
                        },
                        '& .MuiPickersCalendarHeader-labelContainer': {
                            fontSize: '0.9rem',
                            margin: 0,
                            padding: '4px 0'
                        },
                        '& .MuiButtonBase-root': {
                            padding: '4px'
                        }
                    }}
                />
            </LocalizationProvider>
        </StyledCalendarContainer>
    );
}
