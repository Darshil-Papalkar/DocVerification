import './App.css'
import {DocumentForm} from "@/components/documentForm/DocumentForm.jsx";
import {Toaster} from "@/components/ui/sonner.jsx";
import {InputForm} from "@/components/documentForm/InputForm.jsx";

function App() {

  return (
      <div className="bg-slate-800 w-full">
        <Toaster position="top-center" />
        <DocumentForm />
          {/*<InputForm />*/}
      </div>
  )
}

export default App
