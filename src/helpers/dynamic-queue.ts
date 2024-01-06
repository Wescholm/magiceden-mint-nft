import {
  SuccessCallback,
  FailureCallback,
  AsyncTask,
  TaskState,
} from "../types";

export class DynamicQueue {
  private onSuccessCallback?: SuccessCallback;
  private onFailureCallback?: FailureCallback;

  private concurrency: number = 1;
  private lastTaskId = 0;
  private running = 0;
  private queue: TaskState[] = [];
  private isActive = false;

  constructor(private readonly task: AsyncTask) {}

  public start() {
    this.isActive = true;
    this.processQueue();
    return this;
  }

  public stop(): void {
    this.isActive = false;
    this.queue = [];
    this.running = 0;
  }

  public setConcurrency(concurrency: number) {
    this.concurrency = concurrency;
    this.loadTasksToQueue();
    if (this.isActive) {
      this.processQueue();
    }
    return this;
  }

  public onSuccess(callback: SuccessCallback) {
    this.onSuccessCallback = callback;
    return this;
  }

  public onFailure(callback: FailureCallback) {
    this.onFailureCallback = callback;
    return this;
  }

  private loadTasksToQueue(): void {
    Array.from({ length: this.concurrency }, (_, i) => i).forEach(() =>
      this.add({ id: this.lastTaskId++, execute: this.task }),
    );
  }

  private add(task: TaskState): void {
    this.queue.push(task);
    this.processQueue();
  }

  private reQueue(task: TaskState): void {}

  private async processQueue(): Promise<void> {
    while (
      this.isActive &&
      this.running < this.concurrency &&
      this.queue.length > 0
    ) {
      const task = this.queue.shift();
      if (task) {
        this.runTask(task);
      }
    }
  }

  private async runTask(task: TaskState): Promise<void> {
    this.running++;
    try {
      const response = await task.execute();
      this.running--;
      this.onSuccessCallback?.(response, task.id);
    } catch (error) {
      this.running--;
      this.onFailureCallback?.(error, task.id);
      if (this.isActive) {
        task.id = this.lastTaskId++;
        this.add(task);
      }
    } finally {
      this.processQueue();
    }
  }
}
