import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { notesAtom, propertiesOfTagsAtom, typeOfTagsAtom } from "../providers"
import { Button } from "./ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

const formSchema = z.object({
  name: z.string().min(1, { message: "Please input the name of property" }),
})

export function AddOption({
  property,
  setClose,
}: {
  property: string
  setClose: () => void
}) {
  const [, setProperties] = useAtom(propertiesOfTagsAtom)
  const [notes, setNotes] = useAtom(notesAtom)
  const [tags] = useAtom(typeOfTagsAtom)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const name = values["name"]

    setProperties((prevProperties) => {
      const updatedProperties = {
        ...prevProperties,
        [property]: [...(prevProperties[property] as string[]), name],
      }

      return updatedProperties
    })

    if (tags[property] === "multiselect") {
      setNotes((prevNotes) => {
        const updatedNotes = [...prevNotes]
        for (let i = 0; i < updatedNotes.length; i++) {
          updatedNotes[i].tags[property].push(false)
        }
        return updatedNotes
      })
    }

    form.setValue("name", "")
    setClose()
  }

  return (
    <DialogContent className="p-6">
      <DialogHeader>
        <DialogTitle>Add Option</DialogTitle>
      </DialogHeader>
      <Separator className="-mx-6 w-auto" />
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name of Property */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="min-h-[68px]">
                  <div className="flex items-center gap-6">
                    <FormLabel>Name: </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-[72px]" />
                </FormItem>
              )}
            />

            <Button type="submit">Add</Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  )
}
