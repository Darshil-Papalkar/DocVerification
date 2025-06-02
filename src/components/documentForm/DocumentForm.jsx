import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label.jsx";
import {toast} from "sonner";
import {z} from "zod";
import axiosInstance from "@/api/axios.js";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Calendar} from "@/components/ui/calendar.jsx";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.jsx";

const FormSchema = z.object({
    firstName: z.string().min(1, {
        message: "First Name must be at least 1 characters.",
    }),
    lastName: z.string().min(1, {
        message: "Last Name must be at least 1 characters.",
    }),
    houseNumber: z.string().min(1, { message: "House number must be at least 1 characters." }),
    streetRoad: z.string().min(1, { message: "Street/Lane must be at least 1 characters." }),
    state: z.string().min(1, { message: "State must be at least 1 characters." }),
    country: z.string().min(1, { message: "Country must be at least 1 characters." }),
    email: z.string().email(),
    phoneNumber: z.string().min(10, { message: "Phone number must be exact 10 characters." }),
    gender: z.enum(["male", "female", "others"], { required_error: "You need to select a gender.", message: "Please select a gender." }),
    dateOfBirth: z.date({ required_error: "A date of birth is required." }),
    passportPhoto: z.instanceof(FileList, { message: "Please upload a valid passport photo." }),
    addressProof: z.instanceof(FileList, { message: "Please upload a valid address proof." }),
    identityProof: z.instanceof(FileList, { message: "Please upload a valid identity proof." }),
});

export function DocumentForm() {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: null,
            email: "",
            phoneNumber: "",
            gender: null,
            houseNumber: "",
            streetRoad: "",
            state: "",
            country: "",
            passportPhoto: undefined,
            addressProof: undefined,
            identityProof: undefined,
        },
    })

    const onSubmit = async (data) => {

        console.log(data);

        const dataBody = {
            fullName: `${data.firstName} ${data.lastName}`,
            address: `${data.houseNumber}, ${data.streetRoad}, ${data.state}, ${data.country}`,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            email: data.email,
            phoneNumber: data.phoneNumber
        };

        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] instanceof FileList) {
                console.log(data[key][0]);
                formData.append(key, data[key][0]);
            }
        });

        formData.append("data", JSON.stringify(dataBody));

        formData.entries().forEach(entry => {
            console.log(entry);
        });

        try {
            const response = await axiosInstance.post("upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response);

        } catch (e) {
            console.error(e);
        }
        finally {
            // delete data.passportPhoto;
            // delete data.addressProof;
            // delete data.identityProof;
            toast("You submitted the following values", {
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
                      <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            })
        }
    };

    return (
        <div className="flex flex-nowrap items-center justify-center space-y-4 h-full min-h-screen py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="w-3/4 space-y-6 bg-stone-100 min-w-[300px] max-w-[600px] px-8 py-12 rounded-2xl">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-center">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row flex-nowrap"
                                        >
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="male" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Male
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="female" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Female
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="others" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Others
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[100%] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (format(field.value, "PPP")) : ('')}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="houseNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Flat/House number</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="streetRoad"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Street/Lane</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="passportPhoto">Passport photo</Label>
                        <Input id="passportPhoto" type="file" accept="image/*,.pdf,.doc,.docx" {...form.register("passportPhoto")}/>
                        <FormDescription>
                            Format supported: .pdf, .doc, .docx, .jpeg, .png, .jpg
                        </FormDescription>
                        <FormMessage/>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="addressProof">Address Proof</Label>
                        <Input id="addressProof" type="file" accept="image/*,.pdf,.doc,.docx" {...form.register("addressProof")} />
                        <FormDescription>
                            Format supported: .pdf, .doc, .docx, .jpeg, .png, .jpg
                        </FormDescription>
                        <FormMessage/>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name="identityProof"*/}
                        {/*    render={({field}) => (*/}
                        {/*        <FormItem className="flex-1">*/}
                        {/*            <FormLabel>Identity Proof</FormLabel>*/}
                        {/*            <FormControl>*/}
                        {/*                <Input type="file" accept="image/*,.pdf,.doc,.docx" {...form.register("identityProof")} />*/}
                        {/*            </FormControl>*/}
                        {/*            <FormDescription>*/}
                        {/*                Format supported: .pdf, .doc, .docx, .jpeg, .png, .jpg*/}
                        {/*            </FormDescription>*/}
                        {/*            <FormMessage/>*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}
                        <Label htmlFor="identityProof">Identity Proof</Label>
                        <Input id="identityProof" type="file" accept="image/*,.pdf,.doc,.docx" {...form.register("identityProof")} />
                        <FormDescription>
                            Format supported: .pdf, .doc, .docx, .jpeg, .png, .jpg
                        </FormDescription>
                        <FormMessage/>
                    </div>
                    <Button
                        type="submit" variant="outline"
                        className="bg-stone-100 hover:bg-stone-50 ">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    )
}
