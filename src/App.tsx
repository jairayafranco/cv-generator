import Preview from "./components/Preview";
import Editor from "./components/Editor";

export default function App() {
  return (
    <div className="md:flex h-screen">
      <Editor />
      <Preview />
    </div>
  );
}
