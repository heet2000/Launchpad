import * as React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Box } from '@mui/material';
import axios from 'axios';

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
  
  &.wfh {
    background: linear-gradient(135deg, #2196f3, #64b5f6) !important;
    color: white !important;
    font-weight: bold;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.6);
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

// Set initial value to March 2025
const initialValue = dayjs('2025-03-15');

// Function to fetch attendance data - exported for direct use by other components
export async function fetchAttendanceData(empId, authToken) {
    if (!empId || !authToken) {
        console.error('Missing empId or authToken');
        return null;
    }

    try {
        // Try with standard headers first
        try {
            const response = await axios.post(`https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/attendance/${empId}?days=31`, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                responseType: 'json',
                withCredentials: true
            });

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.log('First attempt failed, trying with Postman-like headers');
            // If first attempt fails, try with Postman-like headers
            const response = await axios.post(`https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/attendance/${empId}?days=31`, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'User-Agent': 'PostmanRuntime/7.30.0'
                },
                responseType: 'json'
            });

            if (response.status === 200) {
                return response.data;
            }
        }
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return null;
    }

    return null;
}

function ServerDay(props) {
    const { attendanceDays = [], leaveDays = [], wfhDays = [], day, outsideCurrentMonth, ...other } = props;

    const today = dayjs();

    // Check if the day is a weekend
    const isWeekendDay = isWeekend(day);

    // Check if the day is in the future
    const isFutureDay = day.isAfter(today, 'day');

    // Check if the day is marked as present (from attendance API)
    const isPresentDay = !outsideCurrentMonth && attendanceDays.includes(day.date());

    // Check if the day is marked as leave
    const isLeaveDay = !outsideCurrentMonth && !isWeekendDay && leaveDays.includes(day.date());

    // Check if the day is marked as WFH
    const isWfhDay = !outsideCurrentMonth && wfhDays.includes(day.date());

    const isToday = day.isSame(today, 'day');

    return (
        <StyledDay
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            className={`
                ${isPresentDay ? 'present' : ''} 
                ${isLeaveDay ? 'leave' : ''} 
                ${isWfhDay ? 'wfh' : ''}
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

export default function DateCalendarServerRequest({ setLeaveData }) {
    const requestAbortController = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [leaveDays, setLeaveDays] = React.useState([]);
    const [attendanceDays, setAttendanceDays] = React.useState([]);
    const [wfhDays, setWfhDays] = React.useState([]);

    const fetchLeaveDays = React.useCallback(async (date) => {
        // Only fetch data for March 2025
        if (date.month() !== 2 || date.year() !== 2025) {
            setLeaveDays([]);
            setAttendanceDays([]);
            setWfhDays([]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);

        try {
            // Get user data from localStorage
            const userData = localStorage.getItem('user');
            if (!userData) {
                console.error('User data not found in localStorage');
                setIsLoading(false);
                return;
            }

            const user = JSON.parse(userData);
            const empId = user.empId;

            // Get auth token from localStorage
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error('Auth token not found in localStorage');
                setIsLoading(false);
                return;
            }

            // Try to fetch attendance data from API
            let response;
            try {
                response = await axios.post(`https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/attendance/${empId || 5}?days=31`, {}, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    responseType: 'json',
                    signal: controller.signal
                });
            } catch (error) {
                console.error('Error in first API request attempt:', error);
                // If first request fails, try with different headers that mimic Postman
                if (!controller.signal.aborted) {
                    console.log('Trying with Postman-like headers');
                    response = await axios.post(`https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/attendance/${empId || 5}?days=31`, {}, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Accept': '*/*',
                            'Content-Type': 'application/json',
                            'User-Agent': 'PostmanRuntime/7.30.0',
                            'Cache-Control': 'no-cache'
                        },
                        responseType: 'json',
                        signal: controller.signal
                    });
                } else {
                    throw error; // Rethrow if aborted
                }
            }

            // Check if we got a valid response
            if (response && response.status === 200) {
                // Check if response is HTML instead of JSON
                const isHtmlResponse = typeof response.data === 'string' &&
                    response.data.includes('<!DOCTYPE html>');

                if (isHtmlResponse) {
                    console.error('Received HTML response instead of JSON');
                    // Try one more time with explicit JSON headers
                    response = await axios.post(`https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/attendance/${empId}?days=31`, {}, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        responseType: 'json',
                        signal: controller.signal
                    });
                }

                // Process the response data
                let attendanceData = response.data?.attendance;
                setLeaveData(response.data?.leave_stats);

                let presentDays = [];
                let absentDays = [];
                let workFromHomeDays = [];

                // Handle different possible response formats
                if (attendanceData) {
                    // First, try with the standard format with arrays
                    if (Array.isArray(attendanceData.PRESENT)) {
                        presentDays = attendanceData.PRESENT
                            .filter(record => typeof record === 'string' && record.includes('-'))
                            .map(record => parseInt(record.split("-")[2]))
                            .filter(day => !isNaN(day));
                    }

                    if (Array.isArray(attendanceData.ABSENT)) {
                        absentDays = attendanceData.ABSENT
                            .filter(record => typeof record === 'string' && record.includes('-'))
                            .map(record => parseInt(record.split("-")[2]))
                            .filter(day => !isNaN(day));
                    }

                    if (Array.isArray(attendanceData.WFH)) {
                        workFromHomeDays = attendanceData.WFH
                            .filter(record => typeof record === 'string' && record.includes('-'))
                            .map(record => parseInt(record.split("-")[2]))
                            .filter(day => !isNaN(day));
                    }

                    // If the standard format doesn't have data, try alternative formats
                    if (presentDays.length === 0 && absentDays.length === 0 && workFromHomeDays.length === 0) {
                        const dataProperty = attendanceData.data || attendanceData.attendance || attendanceData;

                        if (dataProperty) {
                            if (Array.isArray(dataProperty.present)) {
                                presentDays = dataProperty.present
                                    .map(d => typeof d === 'string' ? parseInt(d.split('-')[2]) : d.day || d.date || null)
                                    .filter(Boolean);
                            }

                            if (Array.isArray(dataProperty.absent)) {
                                absentDays = dataProperty.absent
                                    .map(d => typeof d === 'string' ? parseInt(d.split('-')[2]) : d.day || d.date || null)
                                    .filter(Boolean);
                            }

                            if (Array.isArray(dataProperty.wfh)) {
                                workFromHomeDays = dataProperty.wfh
                                    .map(d => typeof d === 'string' ? parseInt(d.split('-')[2]) : d.day || d.date || null)
                                    .filter(Boolean);
                            }

                            // Try with an array of records with status fields
                            if (Array.isArray(dataProperty)) {
                                dataProperty.forEach(record => {
                                    if (!record || !record.date) return;

                                    const day = typeof record.date === 'string'
                                        ? parseInt(record.date.split('-')[2])
                                        : record.day || null;

                                    if (!day) return;

                                    const status = record.status?.toUpperCase();
                                    if (status === 'PRESENT') {
                                        presentDays.push(day);
                                    } else if (status === 'ABSENT') {
                                        absentDays.push(day);
                                    } else if (status === 'WFH') {
                                        workFromHomeDays.push(day);
                                    }
                                });
                            }
                        }
                    }
                }

                setAttendanceDays(presentDays);
                setLeaveDays(absentDays);
                setWfhDays(workFromHomeDays);
            } else {
                console.error('Invalid response status:', response?.status);
            }
        }
        catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching attendance data:', error);
            }
        }
        finally {
            setIsLoading(false);
        }

        requestAbortController.current = controller;
    }, [setLeaveData])

    // Fetch data immediately on component mount
    React.useEffect(() => {
        fetchLeaveDays(initialValue);
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, [fetchLeaveDays]);

    // Listen for attendance marked event
    React.useEffect(() => {
        const handleAttendanceMarked = (event) => {
            console.log('Attendance marked event received', event.detail);

            // Extract details from the event
            const { date, status, empId } = event.detail;

            if (date && status && empId) {
                console.log(`Attendance marked: ${status} for ${empId} on ${date}`);

                // Immediately update local state to show feedback while we re-fetch
                if (date.startsWith('2025-03-')) {
                    const day = parseInt(date.split('-')[2]);

                    if (status === 'Present') {
                        // Update attendance days
                        setAttendanceDays(prev => {
                            if (!prev.includes(day)) {
                                return [...prev, day];
                            }
                            return prev;
                        });

                        // Remove from other categories
                        setLeaveDays(prev => prev.filter(d => d !== day));
                        setWfhDays(prev => prev.filter(d => d !== day));

                    } else if (status === 'Absent') {
                        // Update leave days
                        setLeaveDays(prev => {
                            if (!prev.includes(day)) {
                                return [...prev, day];
                            }
                            return prev;
                        });

                        // Remove from other categories
                        setAttendanceDays(prev => prev.filter(d => d !== day));
                        setWfhDays(prev => prev.filter(d => d !== day));

                    } else if (status === 'WFH') {
                        // Update WFH days
                        setWfhDays(prev => {
                            if (!prev.includes(day)) {
                                return [...prev, day];
                            }
                            return prev;
                        });

                        // Remove from other categories
                        setAttendanceDays(prev => prev.filter(d => d !== day));
                        setLeaveDays(prev => prev.filter(d => d !== day));
                    }
                }

                // Now fetch from the API to ensure our data is in sync
                fetchLeaveDays(initialValue);
            } else {
                console.warn('Attendance marked event missing required details');
                fetchLeaveDays(initialValue);
            }
        };

        // Add event listener
        window.addEventListener('attendanceMarked', handleAttendanceMarked);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('attendanceMarked', handleAttendanceMarked);
        };
    }, [fetchLeaveDays]);

    // Disable the month change functionality entirely
    const handleMonthChange = (date) => {
        // Always reset back to March 2025
        return initialValue;
    };

    return (
        <StyledCalendarContainer>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    loading={isLoading}
                    defaultValue={initialValue}
                    value={initialValue}
                    onMonthChange={handleMonthChange}
                    minDate={dayjs('2025-03-01')}
                    maxDate={dayjs('2025-03-31')}
                    disableFuture={false}
                    disablePast={false}
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: ServerDay,
                    }}
                    slotProps={{
                        day: {
                            leaveDays,
                            attendanceDays,
                            wfhDays,
                        },
                    }}
                    sx={{
                        width: '100%',
                        height: '100%',
                        // Disable month switch buttons and navigation
                        '& .MuiPickersArrowSwitcher-root': {
                            display: 'none',
                        },
                        '& .MuiPickersCalendarHeader-switchViewButton': {
                            display: 'none'
                        },
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
