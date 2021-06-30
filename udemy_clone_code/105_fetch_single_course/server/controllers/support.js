import Support from "../models/support";

export const issues = async (req, res) => {
  try {
    const list = await Support.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name email")
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (err) {
    console.log(err);
  }
};

export const markResolved = async (req, res) => {
  try {
    // check if user owns the issue to udpate
    const issue = await Support.findById(req.body.issueId).exec();
    // console.log("issue", issue);
    if (issue.postedBy.toString() !== req.user._id.toString()) {
      res.sendStatus(403);
    }
    const resolved = await Support.findByIdAndUpdate(req.body.issueId, {
      resolved: true,
    }).exec();
    // console.log("__resolved__", resolved);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const removeIssue = async (req, res) => {
  try {
    // check if user owns the issue to udpate
    const issue = await Support.findById(req.params.issueId).exec();
    // console.log("issue", issue);
    if (issue.postedBy.toString() !== req.user._id.toString()) {
      res.sendStatus(403);
    }
    const resolved = await Support.findByIdAndRemove(req.params.issueId).exec();
    // console.log("__resolved__", resolved);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
