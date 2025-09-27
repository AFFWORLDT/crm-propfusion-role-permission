import SectionTop from "../../ui/SectionTop";
import CalendarBase from "../../features/calendar/CalendarBase";
import { useCalendarTasks } from "../../features/calendar/useGetAllCalendarTask";
import TabBar from "../../ui/TabBar";

function Calendar() {
  const { data, isLoading } = useCalendarTasks();

  return (
    <div className="sectionContainer"> 
      <SectionTop heading="Calendar">
        <TabBar
          tabs={[
            {
              id: "CALENDAR",
              label: "Calendar",
              bgColor: "#f0f7ff",
              fontColor: "#4d94ff",
              path: "/calendar",
            },
          ]}
          activeTab={"CALENDAR"}
          navigateTo={() => `/calendar`}
        />
      </SectionTop> 
      <section className="sectionStyles" style={{ backgroundColor: "#f0f7ff" }}>
        <CalendarBase data={data} isLoading={isLoading} /> 
      </section>
    </div>
  );
}

export default Calendar;