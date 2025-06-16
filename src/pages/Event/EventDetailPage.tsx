import EventDetail from '../../components/event/EventDetail'

export default function EventDetailPage() {
  return (
    <>
      <h1>DETAIL DE L'EVENEMENT </h1>
      <section className="flex flex-col md:flex-row justify-center items-center gap-4 ">
        <EventDetail />
      </section>
    </>
  )
}
