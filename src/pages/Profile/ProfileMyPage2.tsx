import { TabsPanel } from "../../components/profile/tabs/TabsPanel";

export default function ProfileMyPage2() {
  return (
    <>
      <main className="grid items-start min-h-[79vh] sm:p-0 sm:relative isolate">
        <span className="absolute left-0 w-full -z-1 bg-joinly_blue-light h-36 block"></span>
        <div className="bg-white min-h-[90vh] rounded-t-4xl border-joinly_blue-contraste border-t-4 mt-4 pb-4 p-2 shadow-custom ___ sm:overflow-hidden sm:min-h-fit sm:pb-2 sm:w-3/5 sm:min-w-[450px] sm:mx-auto sm:rounded-4xl">
            <TabsPanel />
        </div>
      </main>
    </>
  )
}
