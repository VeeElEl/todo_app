from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from sqlmodel import Session, select, col

from ..models import Task
from ..schemas import TaskCreate, TaskRead
from ..deps import get_db, get_current_user
from ..models import User

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[TaskRead])
def list_tasks(
    status: Optional[bool] = Query(None, description="true|false"),
    sort: Optional[str] = Query(None, description="created|status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Task).where(Task.owner_id == current_user.id)
    if status is not None:
        stmt = stmt.where(Task.is_done == status)
    if sort == "created":
        stmt = stmt.order_by(Task.created_at.desc())
    elif sort == "status":
        stmt = stmt.order_by(Task.is_done, Task.created_at.desc())
    return db.exec(stmt).all()

@router.post("/", response_model=TaskRead, status_code=201)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(**data.dict(), owner_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.get(Task, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    for k, v in data.dict().items():
        setattr(task, k, v)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.get(Task, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
