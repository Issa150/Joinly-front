import EventList from "../../components/event/EventList";


export default function EventListPage() {
  return (
  <>
    <h1> Liste des événements </h1>
    <section className="flex flex-col md:flex-row justify-center items-center gap-4 ">
                <EventList />
    </section>
  </>
  );
}
