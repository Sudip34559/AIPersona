import * as React from "react";
import { Bot, Trash2 } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import reduceString from "@/helper/reduceDtring";
import { formatLastActivity } from "@/helper/formateSctivity";
import api from "@/API/api";
// This is sample data

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  halgelSelect: (id: string) => void;
  setId: (id: string) => void;
};

export function AppSidebar({ setId, halgelSelect, ...props }: AppSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState("");
  const [reload, setReload] = React.useState(false);
  type Conversation = { name: string; [key: string]: any };
  const [conversations, setconversations] = React.useState<Conversation[]>([]);
  const d = localStorage.getItem("userData");
  const data = d ? JSON.parse(d) : {};
  const user = {
    name: data.name || "user",
    email: data.email || "user@example.com",
    avatar: "/avatars/shadcn.jpg",
  };
  React.useEffect(() => {
    // Fetching data from the server
    api.get("/ai/conversations").then((response) => {
      console.log("Conversations fetched:", response.data.conversations);

      setconversations(response.data.conversations);
    });
  }, [reload]);

  const createConversation = (type: string) => {
    api
      .post("/ai/conversation", {
        type,
      })
      .then((response) => {
        // console.log("Conversation created:", response.data.conversation);
        // setconversations((prev) => [...prev, response.data.conversation]);
        halgelSelect(response.data.conversation.id);
        setReload(!reload);
        setActiveItem(response.data.conversation.id);
      })
      .catch((error) => {
        console.error("Error creating conversation:", error);
      });
  };

  const handleDelete = (id: string) => {
    api
      .delete(`/ai/conversation/${id}`)
      .then(() => {
        setReload(!reload);
        setId("");
      })
      .catch((error) => {
        console.error("Error creating conversation:", error);
      });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Bot className="size-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem
                  onClick={() => {
                    createConversation("hitesh");
                  }}
                >
                  <SidebarMenuButton
                    tooltip={{
                      children: "Hitesh Choudhary",
                      hidden: false,
                    }}
                    className="px-2.5 md:px-2"
                  >
                    <img src="/11613311.png" alt="" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem
                  onClick={() => {
                    createConversation("piyush");
                  }}
                >
                  <SidebarMenuButton
                    tooltip={{
                      children: "Piyush Garg",
                      hidden: false,
                    }}
                    className="px-2.5 md:px-2"
                  >
                    <img width={70} src="/download.jpg" alt="" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          Persona AI
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {conversations.map((c, i) => (
                <div
                  onClick={() => {
                    halgelSelect(c._id);
                    setActiveItem(c._id);
                  }}
                  key={i}
                  className="hover:bg-sidebar-accent cursor-pointer hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{reduceString(c.name, 20)}</span>{" "}
                    <span className="ml-auto text-xs">
                      {formatLastActivity(c.lastActivity)}
                    </span>
                  </div>

                  <div className="w-full flex gap-2 items-center justify-between">
                    {" "}
                    <span
                      className={`font-medium w-3 h-3 rounded-full uppercase ${
                        activeItem == c._id && "text-green-400"
                      } `}
                    >
                      {c.type || "Test"}
                    </span>
                    <button
                      onClick={() => {
                        handleDelete(c._id);
                      }}
                      className="text-red-400 cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
