using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.SceneManagement;

public class FOverBothObjectsCheck : MonoBehaviour
{
    public string gameOverSceneName = "GameOverScene"; 
 
    private Collider2D thisCollider;


    private void Start() {
        thisCollider = this.GetComponent<Collider2D>();
    }

    private void Update(){
                
        
        List<Collider2D> colliders = new ();
        ContactFilter2D contactFilter = new ContactFilter2D();
        contactFilter.NoFilter();
        
        thisCollider.OverlapCollider(contactFilter, colliders);

        if (colliders.Exists(item => item.CompareTag("Player"))    &&    colliders.Exists(item => item.CompareTag("Enemy")))
        SceneManager.LoadScene(gameOverSceneName);
            
        

    }

}






