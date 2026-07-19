"""Summary Agent - Generates comprehensive output from gathered context."""
from app.agents.base import AgentState, add_trace


async def summary_agent(state: AgentState) -> AgentState:
    emails = state.get("emails", [])
    events = state.get("calendar_events", [])
    notes = state.get("notes", [])
    files = state.get("files", [])
    query = state.get("query", "")

    # Generate Meeting Summary
    meeting_parts = []
    if events:
        for event in events[:3]:
            meeting_parts.append(f"**{event['title']}**: {event['description'][:200]}")
    meeting_summary = "\n\n".join(meeting_parts) if meeting_parts else "No specific meeting context found. Generating general summary based on available data."

    # Generate Agenda
    agenda = []
    if events:
        primary_event = events[0]
        agenda.append(f"Review: {primary_event['title']}")
        agenda.append("Discuss key updates and progress")
    if notes:
        for note in notes[:3]:
            agenda.append(f"Review notes: {note['title']}")
    if not agenda:
        agenda = ["Review current project status", "Discuss upcoming priorities", "Action item review"]

    # Generate Action Items
    action_items = []
    for note in notes[:2]:
        content = note.get("content", "")
        if "action" in content.lower() or "todo" in content.lower() or "due" in content.lower():
            lines = content.split("\n")
            for line in lines:
                line = line.strip()
                if line.startswith("-") and ("due" in line.lower() or "action" in line.lower()):
                    action_items.append(line.lstrip("- "))
    if not action_items:
        action_items = [
            "Review all attached documents before meeting",
            "Prepare status update for the team",
            "Follow up on pending action items from previous meeting",
        ]

    # Generate Questions
    questions = []
    if emails:
        for email in emails[:2]:
            if "proposal" in email.get("subject", "").lower() or "question" in email.get("body", "").lower():
                questions.append(f"Follow up on: {email['subject']}")
    questions.extend([
        "What are the key blockers we need to address?",
        "Are we on track for the Q4 milestones?",
        "Any budget or resource constraints to discuss?",
    ])

    # Generate Email Draft
    event_context = events[0]["title"] if events else "the upcoming meeting"
    email_draft = f"""Subject: Re: {event_context}

Hi team,

I wanted to follow up regarding {event_context}. I've reviewed the relevant materials and have a few points to discuss:

1. Progress update on current milestones
2. Key decisions needed from the team
3. Resource allocation for next sprint

Please review the attached notes and let me know if you have any additional items to add to the agenda.

Best regards"""

    # Generate PPT Outline
    ppt_outline = f"""Presentation Outline: {query.title()}

Slide 1: Title Slide
- {query.title()}
- Date and presenter info

Slide 2: Agenda
- {chr(10).join(f'  • {item}' for item in agenda[:4])}

Slide 3: Context Overview
- Summary of relevant emails and communications
- Key stakeholders involved

Slide 4: Current Status
- Progress on deliverables
- Metrics and KPIs

Slide 5: Discussion Points
- {chr(10).join(f'  • {q}' for q in questions[:3])}

Slide 6: Action Items
- {chr(10).join(f'  • {item}' for item in action_items[:3])}

Slide 7: Next Steps & Timeline
- Key dates and milestones
- Follow-up meetings"""

    trace = add_trace(state, "summary_agent", "generated_output", {
        "agenda_items": len(agenda),
        "action_items": len(action_items),
        "questions": len(questions),
    })

    return {
        **state,
        "meeting_summary": meeting_summary,
        "agenda": agenda,
        "action_items": action_items,
        "questions": questions,
        "email_draft": email_draft,
        "ppt_outline": ppt_outline,
        "agent_trace": trace,
        "current_agent": "summary_agent",
    }
