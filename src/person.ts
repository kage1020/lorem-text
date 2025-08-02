import firstNamesData from "./data/first_name.json"
import lastNamesData from "./data/last_name.json"

export function getLastNames(): string[] {
  return lastNamesData.map((row) => row[0]) // kanji names
}

export function getFirstNames(): string[] {
  return firstNamesData.map((row) => row[0]) // kanji names
}
