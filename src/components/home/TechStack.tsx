import { techStack } from "@/data/techstack";
import { resolveGroups } from "@/lib/techIcons";
import TechStackScatter from "./TechStackScatter";

/** Server: logo di-resolve di sini (simple-icons tidak ikut ke bundle browser), animasi di client. */
export default function TechStack() {
  return <TechStackScatter label={techStack.label} heading={techStack.heading} groups={resolveGroups(techStack.groups)} />;
}
