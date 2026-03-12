import { useState, useEffect } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useApiError } from "@levelup/shared-hooks";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import {
  sonnerToast,
  Button,
  Input,
  Label,
  Textarea,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@levelup/shared-ui";
import { Bot, Plus, Trash2, Save } from "lucide-react";

interface AgentConfig {
  id: string;
  type: "evaluator" | "tutor";
  name: string;
  model?: string;
  systemPrompt?: string;
  enabled: boolean;
}

interface AgentConfigPanelProps {
  spaceId: string;
}

export default function AgentConfigPanel({ spaceId }: AgentConfigPanelProps) {
  const tenantId = useCurrentTenantId();
  const { handleError } = useApiError();
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId || !spaceId) return;
    const load = async () => {
      try {
        const { db } = getFirebaseServices();
        const colRef = collection(
          db,
          `tenants/${tenantId}/spaces/${spaceId}/agents`
        );
        const snap = await getDocs(colRef);
        setAgents(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AgentConfig)
        );
      } catch (err) {
        handleError(err, "Failed to load agents");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tenantId, spaceId, handleError]);

  const handleAddAgent = async (type: "evaluator" | "tutor") => {
    if (!tenantId || !spaceId) return;
    try {
      const { db } = getFirebaseServices();
      const colRef = collection(
        db,
        `tenants/${tenantId}/spaces/${spaceId}/agents`
      );
      const newId = `${type}_${Date.now()}`;
      const newAgent: Omit<AgentConfig, "id"> = {
        type,
        name: type === "evaluator" ? "AI Evaluator" : "AI Tutor",
        model: "gpt-4",
        systemPrompt: "",
        enabled: true,
      };
      await setDoc(doc(colRef, newId), {
        ...newAgent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setAgents((prev) => [...prev, { id: newId, ...newAgent }]);
      sonnerToast.success(`${type === "evaluator" ? "Evaluator" : "Tutor"} agent added`);
    } catch (err) {
      handleError(err, "Failed to add agent");
    }
  };

  const handleSaveAgent = async (agent: AgentConfig) => {
    if (!tenantId || !spaceId) return;
    setSaving(agent.id);
    try {
      const { db } = getFirebaseServices();
      const docRef = doc(
        db,
        `tenants/${tenantId}/spaces/${spaceId}/agents`,
        agent.id
      );
      const { id: _, ...data } = agent;
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      sonnerToast.success("Agent configuration saved");
    } catch (err) {
      handleError(err, "Failed to save agent");
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!tenantId || !spaceId) return;
    try {
      const { db } = getFirebaseServices();
      await deleteDoc(
        doc(db, `tenants/${tenantId}/spaces/${spaceId}/agents`, agentId)
      );
      setAgents((prev) => prev.filter((a) => a.id !== agentId));
      sonnerToast.success("Agent removed");
    } catch (err) {
      handleError(err, "Failed to remove agent");
    }
  };

  const updateAgent = (id: string, updates: Partial<AgentConfig>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Agent Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure AI evaluators and tutors for this space
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAddAgent("evaluator")}>
            <Plus className="h-3.5 w-3.5" /> Add Evaluator
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddAgent("tutor")}>
            <Plus className="h-3.5 w-3.5" /> Add Tutor
          </Button>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Bot className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No agents configured yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add an evaluator or tutor to enable AI-powered features
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <Badge variant={agent.type === "evaluator" ? "default" : "secondary"}>
                    {agent.type}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Switch
                      checked={agent.enabled}
                      onCheckedChange={(v) =>
                        updateAgent(agent.id, { enabled: v })
                      }
                      id={`enabled-${agent.id}`}
                    />
                    <Label htmlFor={`enabled-${agent.id}`} className="cursor-pointer text-xs">
                      Enabled
                    </Label>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleSaveAgent(agent)}
                    disabled={saving === agent.id}
                  >
                    <Save className="h-3 w-3" />
                    {saving === agent.id ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    aria-label="Delete agent"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    type="text"
                    value={agent.name}
                    onChange={(e) =>
                      updateAgent(agent.id, { name: e.target.value })
                    }
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Model</Label>
                  <Select
                    value={agent.model}
                    onValueChange={(v) => updateAgent(agent.id, { model: v })}
                  >
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
                      <SelectItem value="claude-opus">Claude Opus</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">System Prompt</Label>
                <Textarea
                  value={agent.systemPrompt}
                  onChange={(e) =>
                    updateAgent(agent.id, { systemPrompt: e.target.value })
                  }
                  rows={3}
                  placeholder={
                    agent.type === "evaluator"
                      ? "Instructions for how this evaluator should grade student responses..."
                      : "Instructions for how this tutor should help students..."
                  }
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
