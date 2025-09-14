import { Webhook } from "svix";

export const clerkWebhooks = async (req, res) => {
    console.log("Clerk Webhook received:", req.body);
    try {
      const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  
      const payload = req.body.toString("utf8"); // raw body as string
      const evt = whook.verify(payload, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
  
      console.log("Clerk webhook event:", evt.type);
  
      const { data, type } = evt;
  
      switch (type) {
        case "user.created": {
          const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            imageUrl: data.image_url,
          };
  
          await User.create(userData);
          console.log("User created:", userData);
          return res.json({ success: true });
        }
  
        case "user.updated": {
          const userData = {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            imageUrl: data.image_url,
          };
          await User.findByIdAndUpdate(data.id, userData);
          console.log("User updated:", data.id);
          return res.json({ success: true });
        }
  
        case "user.deleted": {
          await User.findByIdAndDelete(data.id);
          console.log("User deleted:", data.id);
          return res.json({ success: true });
        }
  
        default:
          console.log("ℹUnhandled webhook event:", type);
          return res.json({ success: true });
      }
    } catch (error) {
      console.error("Clerk webhook error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  };