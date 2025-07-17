import { useState } from "react";
import { Box, Grid, Typography, TextField, Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { isSameDay } from "date-fns";
import { useParams } from "react-router-dom";
import { useEventStorageContext } from "../EventContext/EventStorageContext";

// Define the DateTimeForm interface
export interface DateTimeForm {
  selectedDates: Date[];
  openingTime: string;
  scheduleNotes: string;
}

export const Calendar = () => {
  const { eventCoreStorageApi } = useEventStorageContext();
  const { id } = useParams();
  const eventId = id || "";
  
  // State to track the month being displayed
  const [calendarMonth, setCalendarMonth] = useState<Date | null>(null);

  // Define initFormState before using it
  const initFormState = (): DateTimeForm => {
    const eventCore = eventCoreStorageApi.getEventCoreById(eventId);
    if (eventCore) {
      const { openingTime, scheduleNotes, dates } =
        eventCore.data.coreEventDates;
      
      const parsedDates = dates.map((date) => new Date(date));
      
      // Set the calendar to display the first selected date's month
      if (parsedDates.length > 0) {
        setCalendarMonth(parsedDates[0]);
      }
      
      return {
        selectedDates: parsedDates,
        openingTime: openingTime,
        scheduleNotes: scheduleNotes,
      };
    }
    // Provide default values when eventCore is not available
    return {
      selectedDates: [],
      openingTime: "",
      scheduleNotes: "",
    };
  };

  // Unified state for all date and time related data
  const [dateTimeForm, setDateTimeForm] = useState<DateTimeForm>(initFormState);

  // Handle day click - toggle selection of the date
  const handleDateSelect = (date: Date) => {
    const dateExists = dateTimeForm.selectedDates.some((selectedDate) =>
      isSameDay(selectedDate, date)
    );
    let updatedDateTimeForm;

    if (dateExists) {
      // Remove the date if it's already selected
      const updatedSelectedDates = dateTimeForm.selectedDates
        .filter((selectedDate) => !isSameDay(selectedDate, date))
        .sort((a, b) => a.getTime() - b.getTime());

      updatedDateTimeForm = {
        ...dateTimeForm,
        selectedDates: updatedSelectedDates,
      };
      
      // If the removed date was the first one and we have other dates, update calendar month
      if (updatedSelectedDates.length > 0 && 
          isSameDay(dateTimeForm.selectedDates[0], date)) {
        setCalendarMonth(updatedSelectedDates[0]);
      }
    } else {
      // Add the date if it's not selected
      const updatedSelectedDates = [...dateTimeForm.selectedDates, date].sort(
        (a, b) => a.getTime() - b.getTime()
      );
      
      updatedDateTimeForm = {
        ...dateTimeForm,
        selectedDates: updatedSelectedDates,
      };
      
      // If this is the first date being added, set it as the calendar month
      if (dateTimeForm.selectedDates.length === 0) {
        setCalendarMonth(date);
      }
    }
    eventCoreStorageApi.updateTimeDates(eventId, updatedDateTimeForm);
    setDateTimeForm(updatedDateTimeForm);
  };

  // Handle text field changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedDateTimeForm = {
      ...dateTimeForm,
      [name]: value,
    };
    eventCoreStorageApi.updateTimeDates(eventId, updatedDateTimeForm);
    setDateTimeForm(updatedDateTimeForm);
  };

  // Custom day renderer to highlight selected days
  const renderDay = (props: PickersDayProps<Date>) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const isSelected = dateTimeForm.selectedDates.some((selectedDate) =>
      isSameDay(selectedDate, day)
    );

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        selected={isSelected}
        onClick={() => handleDateSelect(day)}
        sx={{
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            "&:focus": {
              backgroundColor: "primary.dark",
            },
          },
        }}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 800, mx: "auto", pt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Event Schedule
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Select Event Date(s)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click on dates to select/deselect multiple days for your event
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <DateCalendar
                  slots={{
                    day: renderDay,
                  }}
                  defaultValue={calendarMonth}
                  value={calendarMonth}
                  onChange={(newDate) => {
                    // We don't want to change selected dates on month change,
                    // so we just update the displayed month
                    if (newDate) {
                      setCalendarMonth(newDate);
                    }
                  }}
                  onMonthChange={(month) => {
                    setCalendarMonth(month);
                  }}
                />
              </Box>
            </Paper>
          </Grid>
          {/* Selected Dates Summary */}
          {dateTimeForm.selectedDates.length > 0 && (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{ p: 2, mt: 2, bgcolor: "primary.50", borderRadius: 2 }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Selected Event Dates: {dateTimeForm.selectedDates.length}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {dateTimeForm.selectedDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, index) => (
                      <Box
                        key={index}
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "16px",
                          fontSize: "0.875rem",
                        }}
                      >
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Box>
                    ))}
                </Box>
              </Paper>
            </Grid>
          )}
          {/* Additional Schedule Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
              Additional Schedule Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Doors Open Time"
              type="time"
              name="openingTime"
              value={dateTimeForm.openingTime}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Schedule Notes"
              name="scheduleNotes"
              value={dateTimeForm.scheduleNotes}
              onChange={handleFormChange}
              placeholder="Add any additional schedule information or special timing instructions..."
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Calendar;
