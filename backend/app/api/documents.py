from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.document import DocumentResponse, DocumentList
from app.services.document_service import DocumentService
from app.services.activity_service import ActivityService
from app.models.activity import ActivityType
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/documents", tags=["Documents"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    contents = await file.read()
    await file.seek(0)
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds 10MB limit")
    service = DocumentService(db)
    doc = await service.upload(current_user.id, file)
    activity_service = ActivityService(db)
    await activity_service.create(
        current_user.id, ActivityType.DOCUMENT_UPLOADED,
        f"Document uploaded: {doc.original_filename}", f"Size: {doc.file_size} bytes",
    )
    return DocumentResponse.model_validate(doc)


@router.get("", response_model=DocumentList)
async def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = DocumentService(db)
    docs, total = await service.list_documents(current_user.id, skip, limit)
    return DocumentList(documents=[DocumentResponse.model_validate(d) for d in docs], total=total)


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = DocumentService(db)
    doc = await service.get_by_id(doc_id, current_user.id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse.model_validate(doc)


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    doc_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = DocumentService(db)
    deleted = await service.delete(doc_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
