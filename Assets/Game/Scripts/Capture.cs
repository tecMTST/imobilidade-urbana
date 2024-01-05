using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class FOverBothObjectsCheck : MonoBehaviour
{
    private GameObject timerController;
    private GameObject monologueController;
    private GameObject jumpScareImage; 
    private Collider2D thisCollider;

    private bool firstTimeCaught;

    private void Start()
    {
        jumpScareImage = GameManagement.Instance.JumpScareImage();
        timerController = GameObject.Find("TimerController");
        monologueController = GameObject.Find("MonologueController");
        thisCollider = this.GetComponent<Collider2D>();
    }

    private void Update()
    {
        List<Collider2D> colliders = new List<Collider2D>();
        ContactFilter2D contactFilter = new ContactFilter2D();
        contactFilter.NoFilter();

        thisCollider.OverlapCollider(contactFilter, colliders);

        if (colliders.Exists(item => item.CompareTag("Player")) && colliders.Exists(item => item.CompareTag("Enemy")))
        {
            jumpScareImage.SetActive(true);
            SoundManager.instance.playScreamSFX();
            timerController.GetComponent<TimerController>().Captured();
            timerController.GetComponent<TimerController>().PauseTimer();
            GameManagement.Instance.SetPlayerPosition();


            StartCoroutine(HideJumpScareImageAfterDelay(1.5f));
        }
    }

    private IEnumerator HideJumpScareImageAfterDelay(float delay)
    {
        yield return new WaitForSeconds(delay);

        monologueController.GetComponent<MonologueController>().Captured();
        jumpScareImage.SetActive(false);
        timerController.GetComponent<TimerController>().ResumeTimer();
        
    }
}
