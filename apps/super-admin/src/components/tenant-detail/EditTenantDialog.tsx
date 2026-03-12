import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callSaveTenant } from "@levelup/shared-services";
import { useApiError } from "@levelup/shared-hooks";
import { sonnerToast as toast } from "@levelup/shared-ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Tenant } from "@levelup/shared-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Button,
  Input,
  Alert,
  AlertDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@levelup/shared-ui";
import { AlertCircle } from "lucide-react";

const editTenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().optional(),
  contactPerson: z.string().optional(),
  website: z.string().url("Valid URL required").optional().or(z.literal("")),
  status: z.enum(["active", "trial", "suspended", "expired", "deactivated"]),
});
type EditTenantFormValues = z.infer<typeof editTenantSchema>;

interface Props {
  tenant: Tenant;
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTenantDialog({ tenant, tenantId, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  const editForm = useForm<EditTenantFormValues>({
    resolver: zodResolver(editTenantSchema),
    values: {
      name: tenant.name,
      contactEmail: tenant.contactEmail,
      contactPhone: tenant.contactPhone ?? "",
      contactPerson: tenant.contactPerson ?? "",
      website: tenant.website ?? "",
      status: tenant.status,
    },
  });

  const updateTenant = useMutation({
    mutationFn: async (data: EditTenantFormValues) => {
      await callSaveTenant({
        id: tenantId,
        data: {
          name: data.name,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone || undefined,
          contactPerson: data.contactPerson || undefined,
          website: data.website || undefined,
          status: data.status,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform", "tenant", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["platform", "tenants"] });
      onOpenChange(false);
      toast.success("Tenant updated successfully");
    },
    onError: (err: unknown) => handleError(err, "Failed to update tenant"),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
          <DialogDescription className="sr-only">Edit tenant details</DialogDescription>
        </DialogHeader>
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit((data) => updateTenant.mutate(data))} className="space-y-4 py-2">
            <FormField control={editForm.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={editForm.control} name="contactEmail" render={({ field }) => (
              <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={editForm.control} name="contactPhone" render={({ field }) => (
              <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={editForm.control} name="contactPerson" render={({ field }) => (
              <FormItem><FormLabel>Contact Person</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={editForm.control} name="website" render={({ field }) => (
              <FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={editForm.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {updateTenant.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{updateTenant.error instanceof Error ? updateTenant.error.message : "Failed to update tenant"}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateTenant.isPending}>Cancel</Button>
              <Button type="submit" disabled={updateTenant.isPending}>{updateTenant.isPending ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
