import { validateRequest } from "@/lib/auth";
import { ConfigurationModel, User } from "@/mongodb/models/mainModel";
import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";


export async function PUT(request: Request, { params }: { params: { assistant_id: string } }) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const req_data = await request.json();
    await connectMongo();

    const existingUser = await User.findById(user.id);

    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }

    const assistant_data = await ConfigurationModel.findById(params.assistant_id);
    for (let key in req_data) {
      assistant_data[key] = req_data[key];
    }
    await assistant_data.save();

    return NextResponse.json(
      { message: "Assistant updated", data: assistant_data },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { assistant_id: string } }) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await connectMongo();

    const existingUser = await User.findById(user.id);

    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }

    const assistant_data = await ConfigurationModel.findByIdAndDelete(params.assistant_id);

    return NextResponse.json(
      { message: "Assistant deleted", data: assistant_data },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { assistant_id: string } }) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await connectMongo();

    const existingUser = await User.findById(user.id);

    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }
    const assistant_data = await ConfigurationModel.findById(params.assistant_id);
    if (!assistant_data) {
      return NextResponse.json({ message: "Assistant not exists" }, { status: 409 });
    }   
    const baseName = assistant_data.assistent_name.split("copy")[0].trim();

    const copies = await ConfigurationModel.find({
      assistent_name: new RegExp(`^${baseName}( copy \\d+)?$`, "i"),
    });

    let maxCopyNumber = 0;
    copies.forEach((copy) => {
      const match = copy.assistent_name.match(/copy (\d+)$/);
      if (match && parseInt(match[1], 10) > maxCopyNumber) {
        maxCopyNumber = parseInt(match[1], 10);
      }
    });

    const newName = `${baseName} copy ${maxCopyNumber + 1}`;
    const newAssistant = await ConfigurationModel.create({
      ...assistant_data.toJSON(),
      assistent_name: newName,
      _id: undefined,
    });

    await newAssistant.save();

    return NextResponse.json(
      { message: "Assistant shared", data: assistant_data },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
