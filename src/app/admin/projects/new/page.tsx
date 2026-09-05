import ProjectEditorPage from "../[id]/page";

export default function NewProjectPage() {
  return <ProjectEditorPage params={Promise.resolve({ id: "new" })} />;
}
