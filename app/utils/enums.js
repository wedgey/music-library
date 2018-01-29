exports.Artist = {

}

exports.Song = {
    Status: {
        Active: "Active",
        Pending: "Pending",
        Deleted: "Deleted"
    }
}

exports.User = {
    Role: {
        Member: "Member",
        Moderator: "Moderator",
        Admin: "Admin",
        System: "System"
    }
}

exports.Task = {
    Status: {
        Queued: "Queued",
        InProgress: "InProgress",
        Completed: "Completed",
        Error: "Error"
    },
    Type: {
        Sync: "Sync"
    }
}