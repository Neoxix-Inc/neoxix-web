"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { TechnologyLevel, TechnologyReference } from "@/data/portfolio";
import { TechnologyList, technologyLevels } from "@/data/technologies";

type TechnologyGroups = Record<TechnologyLevel, readonly TechnologyReference[]>;

export function TechnologyTabs({ groups }: { groups: TechnologyGroups }) {
  const [selectedLevel, setSelectedLevel] = useState<TechnologyLevel>("Experience");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectAndFocus(index: number) {
    const level = technologyLevels[index];
    setSelectedLevel(level);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % technologyLevels.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + technologyLevels.length) % technologyLevels.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = technologyLevels.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectAndFocus(nextIndex);
  }

  return (
    <div className="technology-tabs">
      <div
        className="technology-tab-list"
        role="tablist"
        aria-label="Technology experience levels"
        data-selected-index={technologyLevels.indexOf(selectedLevel)}
      >
        {technologyLevels.map((level, index) => {
          const isSelected = selectedLevel === level;
          const slug = level.toLowerCase();

          return (
            <button
              className="technology-tab"
              id={`technology-tab-${slug}`}
              key={level}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`technology-panel-${slug}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedLevel(level)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => { tabRefs.current[index] = element; }}
            >
              <span>{level}</span>
              <span className="technology-tab-count" aria-label={`${groups[level].length} technologies`}>
                {groups[level].length}
              </span>
            </button>
          );
        })}
      </div>

      {technologyLevels.map((level) => {
        const isSelected = selectedLevel === level;
        const slug = level.toLowerCase();

        return (
          <div
            className="technology-tab-panel"
            id={`technology-panel-${slug}`}
            key={`${level}-${isSelected ? "active" : "inactive"}`}
            role="tabpanel"
            aria-labelledby={`technology-tab-${slug}`}
            tabIndex={0}
            hidden={!isSelected}
          >
            {groups[level].length ? (
              <TechnologyList technologies={groups[level]} label={`${level} technologies`} />
            ) : (
              <div className="technology-empty">
                <p><strong>No planned technologies yet.</strong></p>
                <p>New tools will appear here when they become a defined learning goal.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
