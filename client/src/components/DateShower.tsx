import React from 'react';

const DateShower: React.FC = () => {
    //#region FIELDS
    const DAYS = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const MONTHS = [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July", 
        "August",
        "September",
        "October",
        "November", 
        "December"
    ];
    //#endregion

    //#region METHODS
    const _GetGreeting = (date: Date): string => {
        let hour = date.getHours();
        if (hour > 18){
            return "Evening";
        }
        if (hour > 12){
            return "Afternoon";
        }
        return "Morning";
    }

    const _GetDayOfMonth = (day: number): string => {
        let end = "th";
        switch (day){
            case 1:
            case 21:
            case 31:
                end = "st";
                break;
            case 2:
            case 22:
                end = "nd";
                break;
            case 3:
            case 23:
                end = "rd";
                break;
            default:
                end = "th";
        }
        return day + end;
    }
    //#endregion

    //#region RENDER
    let date = new Date();
    let dayOfWeek = DAYS[date.getDay()];
    let month = MONTHS[date.getMonth()];
    let dayOfMonth = _GetDayOfMonth(date.getDate());
    let year = date.getFullYear();
    return (<div id="date-greeter">
        <em>
        {`Good ${_GetGreeting(date)}! It is ${dayOfWeek}, the ${dayOfMonth} of ${month}, ${year}.`}
        </em>
    </div>);
    //#endregion
}

//EXPORT
export default DateShower;