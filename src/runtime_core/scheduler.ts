const queue: any[] = []

let isFlushingPending = false
const p = Promise.resolve()

export function nextTick(fn) {
  return fn ? p.then(fn) : p
}

export function queueJobs(job) {
  if(!queue.includes(job)) {
    queue.push(job)
  }
  queueFlush()
}

function queueFlush() {
  if(isFlushingPending) return
  isFlushingPending = true

  nextTick(flushJobs)
}

function flushJobs() {
  isFlushingPending = false
  let job
  while(job = queue.shift()) {
    job && job()
  }
}