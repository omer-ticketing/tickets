import Ticket from "../ticketModel";

it("Implements optimistic concurrency issue", async () => {
    const ticket = await Ticket.build({ title: "A ticket", price: 26, userId: "34" });
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	firstInstance!.set({price: 80})
	secondInstance!.set({price: 90})

	await firstInstance!.save(); 

	try {
		await secondInstance!.save();
	} catch (err) {
		return; // exit the test - means we had the expected error
	}

	throw new Error("Should not reach this point.")
});

it("Increments the version number on multiple saves", async () => {
	const ticket = await Ticket.build({ title: "A ticket", price: 26, userId: "34" });
	expect(ticket.version).toEqual(0)
	await ticket.save();
	expect(ticket.version).toEqual(1)
	await ticket.save();
	expect(ticket.version).toEqual(2)
})