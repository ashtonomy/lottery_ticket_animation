## The Lottery Ticket Hypothesis: A D3 Visualization

This repo contains d3js code for an animation of an iterative pruning algorithm from [The Lottery Ticket Hypothesis](https://arxiv.org/abs/1803.03635) (Frankle & Carbin, 2018) to find winning tickets in dense feed-forward networks. At the risk of reductionism (pun most certainly intended), we can say that the _lottery ticket hypothesis_ proposes that randomly-initialized networks contain subnetworks, or _winning tickets_,  that perform on par with the original network while having far fewer parameters. More specifically, these subnetworks have initializations that are particularly amenable to optimization. Leveraging this observation, the authors propose an iterative strategy to identify and isolate winning tickets by pruning smallest-magnitude weights during training. This animation loosely implements iterative strategy 2 (Appendix B, Frankle & Carbin) from the paper: _Iterative pruning with continued training._

---

**Disclaimer**: This is a project that was started as a visualization aide for a presentation but never really finished. I'm pushing what I have since someone might find it useful, but as is this is not exactly a faithful representation. Here's short checklist of changes needed (by no means comprehensive): 
- [ ] Implement animation for strategy 1 (This should be relatively trivial. Weights and colors should just be reset to initial values after each pruning step.).
- [ ] Initialize network (Gaussian Glorot, for fidelity) at the beginning to emphasize initialization importance. 
- [ ] Add pruning logic to prevent "floating" weights.
- [ ] Replicate architectures from the original paper (ambitious).
