"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Module, ModuleMetadata, ModuleRelationship, DifficultyLevel } from "@/types/module";
import { useModuleStore } from "@/store/module-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ModuleOrganizer() {
  const { 
    modules, 
    addModule, 
    updateMetadata,
    suggestedSequence,
    updateSequence
  } = useModuleStore();
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [isGeneratingSequence, setIsGeneratingSequence] = useState(false);

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) {
      console.log("Error", "Module title is required");
      return;
    }

    const newModule: Module = {
      id: crypto.randomUUID(),
      title: newModuleTitle,
      description: newModuleDescription,
      lessons: [],
      order: modules.length,
    };

    addModule(newModule);
    setNewModuleTitle("");
    setNewModuleDescription("");

    console.log("Success", "Module created successfully");
  };

  const handleUpdateMetadata = (moduleId: string) => {
    return (metadata: {
      prerequisites: string[]
      difficulty: "beginner" | "intermediate" | "advanced"
      estimatedDuration: number
    }) => {
      updateMetadata(moduleId, {
        ...metadata,
        suggestedNext: [], 
      });
    };
  };

  const generateSequenceSuggestions = async () => {
    setIsGeneratingSequence(true);
    try {
      const response = await fetch("/api/module-sequence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ modules }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate sequence suggestions");
      }

      const data = await response.json();
      updateSequence(data.suggestedOrder);
      
      data.relationships.forEach((rel: ModuleRelationship) => {
        updateMetadata(rel.moduleId, {
          prerequisites: rel.prerequisites,
          difficulty: rel.difficulty,
          estimatedDuration: rel.estimatedDuration,
          suggestedNext: rel.suggestedNext,
        });
      });
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsGeneratingSequence(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Module Organization</h2>
        <Button
          onClick={generateSequenceSuggestions}
          disabled={isGeneratingSequence}
          className="cursor-pointer"
        >
          {isGeneratingSequence
            ? "Generating..."
            : "Generate Sequence Suggestions"}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="moduleTitle">Module Title</Label>
            <Input
              id="moduleTitle"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Enter module title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moduleDescription">Module Description</Label>
            <Input
              id="moduleDescription"
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
              placeholder="Enter module description"
            />
          </div>
        </div>
        <Button className="cursor-pointer" onClick={handleAddModule}>Add Module</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <div key={module.id} className="rounded-lg border p-4 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Edit Metadata
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Module Metadata</DialogTitle>
                  </DialogHeader>
                  <ModuleMetadataForm
                    module={module}
                    onUpdate={handleUpdateMetadata(module.id)}
                    allModules={modules}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {module.metadata && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Difficulty:</span>
                  <span className="capitalize">
                    {module.metadata.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Duration:</span>
                  <span>{module.metadata.estimatedDuration} minutes</span>
                </div>
                {module.metadata.prerequisites.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Prerequisites:</span>
                    <ul className="list-disc pl-5 mt-1">
                      {module.metadata.prerequisites.map((prereqId) => {
                        const prereqModule = modules.find(
                          (m) => m.id === prereqId
                        );
                        return <li key={prereqId}>{prereqModule?.title}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-md border bg-card p-2 text-sm"
                >
                  {lesson.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {suggestedSequence.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Suggested Learning Path
          </h3>
          <div className="space-y-2">
            {suggestedSequence.map((moduleId, index) => {
              const currentModule = modules.find((m) => m.id === moduleId);
              if (!currentModule) return null;
              return (
                <div
                  key={moduleId}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <span className="text-2xl font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium">{currentModule.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentModule.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ModuleMetadataFormProps {
  module: Module
  onUpdate: (metadata: ModuleMetadata) => void
  allModules: Module[]
}

const ModuleMetadataForm: React.FC<ModuleMetadataFormProps> = ({ module, onUpdate, allModules }) => {
  const [formData, setFormData] = useState<ModuleMetadata>({
    prerequisites: module.metadata?.prerequisites || [],
    difficulty: (module.metadata?.difficulty || "beginner") as DifficultyLevel,
    estimatedDuration: module.metadata?.estimatedDuration || 0,
    suggestedNext: module.metadata?.suggestedNext || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Estimated Duration (minutes)</Label>
        <Input
          type="number"
          value={formData.estimatedDuration}
          onChange={(e) =>
            setFormData({
              ...formData,
              estimatedDuration: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Prerequisites</Label>
        <div className="space-y-2">
          {allModules
            .filter((m) => m.id !== module.id)
            .map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`prereq-${m.id}`}
                  checked={formData.prerequisites.includes(m.id)}
                  onChange={(e) => {
                    const newPrereqs = e.target.checked
                      ? [...formData.prerequisites, m.id]
                      : formData.prerequisites.filter((id: string) => id !== m.id)
                    setFormData({ ...formData, prerequisites: newPrereqs })
                  }}
                />
                <Label htmlFor={`prereq-${m.id}`}>{m.title}</Label>
              </div>
            ))}
        </div>
      </div>

      <Button type="submit">Save Metadata</Button>
    </form>
  );
};
