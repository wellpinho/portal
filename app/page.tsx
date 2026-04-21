import { redirect } from "next/navigation";
import { DEFAULT_CITY_PATH } from "@/lib/locations";

export default function HomePage() {
  redirect(DEFAULT_CITY_PATH);
}
